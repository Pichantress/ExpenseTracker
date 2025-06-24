import React, { useEffect, useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";

const BALANCE_KEY = "balance_saldo";

export default function BalancePage() {
  const { expenses } = useExpenses();
  const navigate = useNavigate();
  const now = new Date();
  const defaultMonth = now.getMonth() + 1;
  const defaultYear = now.getFullYear();

  const [balance, setBalance] = useState(0);
  const [inputBalance, setInputBalance] = useState("");
  const [editing, setEditing] = useState(false);

  /* Untuk Kategori per Bulan */
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  /* Untuk Kategori per Tahun */
  const [selectedYear2, setSelectedYear2] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(BALANCE_KEY);
    if (saved) setBalance(Number(saved));
  }, []);

  useEffect(() => {
    const now = new Date();
    if (selectedMonth && !selectedYear) {
      setSelectedYear(String(now.getFullYear()));
    } else if (selectedYear && !selectedMonth) {
      setSelectedMonth(String(now.getMonth() + 1));
    }
  }, [selectedMonth, selectedYear]);

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const monthToCheck = selectedMonth ? parseInt(selectedMonth) : defaultMonth;
    const yearToCheck = selectedYear ? parseInt(selectedYear) : defaultYear;

    return month === monthToCheck && year === yearToCheck;
  });

  const filteredExpensesYear = expenses.filter((e) => {
    const date = new Date(e.date);
    const year = date.getFullYear();

    const yearToCheck = selectedYear2 ? parseInt(selectedYear2) : defaultYear;

    return year === yearToCheck;
  });

  const categoryTotalMonth = (category) => {
    return filteredExpenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  };

  const categoryTotalYear = (category) => {
    return filteredExpensesYear
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  };

  const handleSave = () => {
    const newBalance = Number(inputBalance);
    if (isNaN(newBalance)) {
      alert("Input tidak valid. Masukkan angka saldo yang benar.");
      return;
    }
    localStorage.setItem(BALANCE_KEY, String(newBalance));
    setBalance(newBalance);
    setEditing(false);
  };

  const totalExpensesMonth = filteredExpenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );

  const totalExpensesYear = filteredExpensesYear.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );

  const allYears = [
    ...new Set(expenses.map((e) => new Date(e.date).getFullYear())),
  ];

  const monthlyCategories = [
    ...new Set(filteredExpenses.map((e) => e.category)),
  ].filter(Boolean);
  const yearlyCategories = [
    ...new Set(filteredExpensesYear.map((e) => e.category)),
  ].filter(Boolean);

  return (
    <>
      <title>Balance</title>

      <div
        style={{
          backgroundColor: "var(--custom-1)",
          color: "var(--custom-12)",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "768px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Ringkasan Keuangan
          </h1>
          <div className="mb-6 grid sm:grid-cols-2 gap-4">
            {/* Saldo */}
            <div
              style={{
                backgroundColor: "var(--custom-5)",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ marginBottom: "0.5rem", color: "var(--gray-11)" }}>
                Saldo Saat Ini:
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#16a34a",
                }}
              >
                {formatRupiah(balance)}
              </div>

              {editing ? (
                <>
                  <input
                    type="number"
                    value={inputBalance}
                    onChange={(e) => setInputBalance(e.target.value)}
                    placeholder="Masukkan saldo baru"
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.375rem",
                      border: "1px solid var(--gray-8)",
                      width: "100%",
                      marginBottom: "0.5rem",
                      backgroundColor: "var(--custom-1)",
                      color: "var(--custom-12)",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={handleSave}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid var(--gray-9)",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        color: "var(--custom-12)",
                        cursor: "pointer",
                      }}
                    >
                      Batal
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setInputBalance(String(balance));
                    setEditing(true);
                  }}
                  style={{
                    backgroundColor: "var(--gray-a6)",
                    border: "1px solid var(--gray-9)",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    color: "var(--custom-12)",
                    cursor: "pointer",
                  }}
                >
                  Edit Saldo
                </button>
              )}
            </div>

            {/* Pengeluaran */}
            <div
              style={{
                backgroundColor: "var(--custom-5)",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ marginBottom: "0.5rem", color: "var(--gray-11)" }}>
                Total Pengeluaran:
              </div>
              {selectedYear2 ? (
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#dc2626",
                  }}
                >
                  {formatRupiah(totalExpensesYear)}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#dc2626",
                  }}
                >
                  {formatRupiah(totalExpensesMonth)}
                </div>
              )}
            </div>

            {/* Kategori */}
            <div
              style={{
                backgroundColor: "var(--custom-2)",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Pengeluaran Bulan{" "}
                {new Date().toLocaleDateString("id-ID", { month: "long" })}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "var(--custom-2)",
                    color: "var(--custom-12)",
                    border: "1px solid var(--gray-5)",
                  }}
                >
                  <option value="">Semua Bulan</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("id-ID", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "var(--custom-2)",
                    color: "var(--custom-12)",
                    border: "1px solid var(--gray-5)",
                  }}
                >
                  <option value="">Semua Tahun</option>
                  {allYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {(selectedMonth || selectedYear) && (
                  <button
                    onClick={() => {
                      setSelectedMonth("");
                      setSelectedYear("");
                    }}
                    className="px-4 py-2 rounded shadow transition"
                    style={{
                      backgroundColor: "var(--custom-6)",
                      color: "var(--custom-12)",
                    }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
              {monthlyCategories.length === 0 ? (
                <p style={{ color: "var(--gray-9)" }}>Belum ada kategori.</p>
              ) : (
                <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
                  {monthlyCategories.map((cat, idx) => {
                    const catExpenses = filteredExpenses.filter(
                      (e) => e.category === cat
                    );
                    const iconName = catExpenses[0]?.icon;
                    const Icon = LucideIcons[iconName] || LucideIcons.Tag;
                    const total = categoryTotalMonth(cat);
                    return (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.75rem",
                          gap: "0.5rem",
                          backgroundColor: "var(--custom-1)",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                        }}
                      >
                        <Icon size={20} color="var(--custom-11)" />
                        <span style={{ flex: 1 }}>{cat}</span>
                        <span style={{ fontWeight: "bold", color: "#dc2626" }}>
                          {formatRupiah(total)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div
              style={{
                backgroundColor: "var(--custom-2)",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Pengeluaran Tahun {selectedYear2 || new Date().getFullYear()}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <select
                  value={selectedYear2}
                  onChange={(e) => setSelectedYear2(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "var(--custom-2)",
                    color: "var(--custom-12)",
                    border: "1px solid var(--gray-5)",
                  }}
                >
                  <option value="">Semua Tahun</option>
                  {allYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {selectedYear2 && (
                  <button
                    onClick={() => setSelectedYear2("")}
                    className="px-4 py-2 rounded shadow transition"
                    style={{
                      backgroundColor: "var(--custom-6)",
                      color: "var(--custom-12)",
                    }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
              {yearlyCategories.length === 0 ? (
                <p style={{ color: "var(--gray-9)" }}>Belum ada kategori.</p>
              ) : (
                <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
                  {yearlyCategories.map((cat, idx) => {
                    const catExpenses = filteredExpensesYear.filter(
                      (e) => e.category === cat
                    );
                    const iconName = catExpenses[0]?.icon;
                    const Icon = LucideIcons[iconName] || LucideIcons.Tag;
                    const total = categoryTotalYear(cat);
                    return (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.75rem",
                          gap: "0.5rem",
                          backgroundColor: "var(--custom-1)",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                        }}
                      >
                        <Icon size={20} color="var(--custom-11)" />
                        <span style={{ flex: 1 }}>{cat}</span>
                        <span style={{ fontWeight: "bold", color: "#dc2626" }}>
                          {formatRupiah(total)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "var(--gray-10)",
              color: "white",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.5rem",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--gray-11)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--gray-10)")
            }
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </>
  );
}
