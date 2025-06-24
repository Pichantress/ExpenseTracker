import { useNavigate, useParams } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, icons as lucideIcons } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

const ExpenseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expenses, addExpense, updateExpense } = useExpenses();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [oldAmount, setOldAmount] = useState(0);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([
    { label: "Makan", icon: "Utensils" },
    { label: "Transportasi", icon: "Car" },
    { label: "Belanja", icon: "ShoppingCart" },
  ]);
  const [customCategories, setCustomCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newIcon, setNewIcon] = useState("Tag");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const allCategories = [...categories, ...customCategories];
  
  const categoryIcons = [
    "Hamburger",
    "Shopping-cart",
    "Car",
    "House",
    "Gift",
    "Smartphone",
    "Shirt",
    "Gamepad2",
    "SprayCan",
    "Hospital",
    "Coins",
    "Book",
    "Baby",
    "PawPrint",
    "PlaneTakeoff",
    "Laptop",
    "Camera",
    "Coffee",
    "Bike",
    "BedSingle",
    "Briefcase",
    "Heart",
  ];
  useEffect(() => {
    const storedBalance = localStorage.getItem("balance_saldo");
    if (storedBalance) setBalance(Number(storedBalance));
  }, []);

  useEffect(() => {
    const found = id ? expenses.find((e) => e.id === id) : null;
    if (found) {
      setAmount(found.amount.toString());
      setOldAmount(found.amount);
      setCategory(found.category);
      setNote(found.note || "");
    }

    const saved = localStorage.getItem("customCategories");
    if (saved) {
      setCustomCategories(JSON.parse(saved));
    }
  }, [id, expenses]);

  const saveCustomCategories = (data) => {
    setCustomCategories(data);
    localStorage.setItem("customCategories", JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Masukkan jumlah yang valid");
      return;
    }
    if (!category.trim()) {
      toast.error("Category Required");
      return;
    }
    let updatedBalance = balance;
    if (id) {
      updatedBalance = balance + oldAmount - amt;
    } else {
      updatedBalance = balance - amt;
    }
    setBalance(updatedBalance);
    localStorage.setItem("balance_saldo", String(updatedBalance));

    const selectedCat = allCategories.find((c) => c.label === category);
    const expense = {
      id: id || Date.now().toString(),
      amount: amt,
      category,
      icon: selectedCat?.icon || "Tag",
      note,
      date: new Date().toISOString().split("T")[0],
    };

    if (id) updateExpense(id, expense);
    else addExpense(expense);
    toast.success("Good job kak!");
    navigate("/");
  };

  const handleCalculatorKey = (val) => {
    if (val === "=") {
      try {
        const result = eval(amount);
        if (!isNaN(result)) setAmount(result.toString());
      } catch {
        alert("Ekspresi tidak valid");
      }
    } else if (val === "AC") {
      setAmount("");
    } else if (val === "⌫") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => prev + val);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const exists = allCategories.some(
      (c) => c.label.toLowerCase() === newCategory.toLowerCase()
    );
    if (exists) {
      alert("Kategori sudah ada");
      return;
    }
    if (!lucideIcons[newIcon]){
      alert ("Icon tidak valid")
      return
    }
    const updated = [
      ...customCategories,
      { label: newCategory, icon: newIcon },
    ];
    saveCustomCategories(updated);
    setNewCategory("");
    setNewIcon("Tag");
  };

  const confirmDeleteCategory = () => {
    const updated = customCategories.filter(
      (c) => c.label !== categoryToDelete.label
    );
    saveCustomCategories(updated);
    if (category === categoryToDelete.label) setCategory("");
    setShowDeleteModal(false);
  };

  const calculatorKeys = [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "*"],
    ["0", ".", "⌫", "/"],
    ["AC", "="],
  ];

  return (
    <>
      <title>Expense Form</title>

      <div
        style={{
          backgroundColor: "var(--custom-1)",
          color: "var(--custom-12)",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "768px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "var(--custom--12)",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "0.375rem",
              }}
              aria-label="Kembali"
            >
              <ArrowLeft size={24} />
            </button>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {id ? "Edit" : "Tambah"} Pengeluaran
            </h1>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "var(--custom--12)",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "0.375rem",
              }}
              aria-label="Simpan"
            >
              <Check size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <label>
              <span style={{ fontSize: "0.875rem" }}>Catatan</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan (opsional)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  backgroundColor: "var(--custom-2)",
                  border: "1px solid var(--gray-5)",
                  color: "var(--custom-12)",
                }}
              />
            </label>

            <div>
              <span style={{ fontSize: "0.875rem" }}>Jumlah</span>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  fontSize: "1.25rem",
                }}
              >
                Rp {amount || "0"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {calculatorKeys.flat().map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCalculatorKey(key)}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.375rem",
                      backgroundColor:
                        key === "=" ? "green" : "var(--custom-3)",
                      color: key === "=" ? "white" : "var(--custom-12)",
                      border: "none",
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.875rem" }}>Kategori</span>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      style={{
                        fontSize: "0.875rem",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <Plus size={16} /> Tambah
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay
                      style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    />
                    <Dialog.Content
                      style={{
                        backgroundColor: "var(--custom-1)",
                        color: "var(--custom-12)",
                        padding: "1.5rem",
                        borderRadius: "0.5rem",
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: "400px",
                        zIndex: 50,
                      }}
                    >
                      <Dialog.Title
                        style={{ fontWeight: "bold", marginBottom: "1rem" }}
                      >
                        Tambah Kategori
                      </Dialog.Title>
                      <input
                        type="text"
                        placeholder="Nama Kategori"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          marginBottom: "1rem",
                          borderRadius: "0.375rem",
                          backgroundColor: "var(--custom-2)",
                          color: "var(--custom-12)",
                          border: "1px solid var(--gray-5)",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          overflowX: "auto",
                          marginBottom: "1rem",
                        }}
                      >
                        {categoryIcons.map((iconName) => {
                          const Icon = lucideIcons[iconName] || lucideIcons.Tag;
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setNewIcon(iconName)}
                              style={{
                                padding: "0.5rem",
                                borderRadius: "0.375rem",
                                border:
                                  newIcon === iconName
                                    ? "2px solid #2563eb"
                                    : "1px solid var(--gray-5)",
                                backgroundColor: "var(--custom-3)",
                              }}
                            >
                              <Icon size={18} />
                            </button>
                          );
                        })}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "0.5rem",
                        }}
                      >
                        <Dialog.Close asChild>
                          <button
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "0.375rem",
                              border: "1px solid var(--gray-5)",
                            }}
                          >
                            Batal
                          </button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                          <button
                            onClick={handleAddCategory}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "0.375rem",
                              backgroundColor: "#2563eb",
                              color: "white",
                              border: "none",
                            }}
                          >
                            Tambah
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {allCategories.map((cat) => {
                  const Icon = lucideIcons[cat.icon] || lucideIcons.Tag;
                  const isActive = category === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (
                          customCategories.find((c) => c.label === cat.label)
                        ) {
                          setCategoryToDelete(cat);
                          setShowDeleteModal(true);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.375rem",
                        border: "1px solid var(--gray-5)",
                        backgroundColor: isActive
                          ? "#2563eb"
                          : "var(--custom-2)",
                        color: isActive ? "white" : "var(--custom-12)",
                      }}
                    >
                      <Icon size={16} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Modal hapus kategori */}
        {showDeleteModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
          >
            <div
              style={{
                backgroundColor: "var(--custom-1)",
                color: "var(--custom-12)",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                width: "90%",
                maxWidth: "400px",
              }}
            >
              <h2 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Hapus Kategori
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Yakin ingin menghapus kategori{" "}
                <strong>"{categoryToDelete?.label}"</strong>?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid var(--gray-5)",
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpenseFormPage;
