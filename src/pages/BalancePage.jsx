import React, { useEffect, useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";

const BALANCE_KEY = "balance_saldo";

export default function BalancePage() {
  const { expenses } = useExpenses();
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [inputBalance, setInputBalance] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(BALANCE_KEY);
    if (saved) setBalance(Number(saved));
  }, []);

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const getCategoryTotal = (category) => {
    return expenses
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

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );
  const categories = [...new Set(expenses.map((e) => e.category))].filter(
    Boolean
  );

  const currentBalance = balance - totalExpenses;
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

          {/* Saldo */}
          <div
            style={{
              backgroundColor: "var(--custom-2)",
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
              {formatRupiah(currentBalance)}
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
                  backgroundColor: "transparent",
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
              backgroundColor: "var(--custom-2)",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ color: "var(--gray-11)" }}>Total Pengeluaran:</div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#dc2626",
              }}
            >
              Rp {totalExpenses.toLocaleString()}
            </div>
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
              Kategori yang Digunakan
            </h2>
            {categories.length === 0 ? (
              <p style={{ color: "var(--gray-9)" }}>Belum ada kategori.</p>
            ) : (
              <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
                {categories.map((cat, idx) => {
                  const catExpenses = expenses.filter(
                    (e) => e.category === cat
                  );
                  const iconName = catExpenses[0]?.icon;
                  const Icon = LucideIcons[iconName] || LucideIcons.Tag;
                  const total = getCategoryTotal(cat);
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
