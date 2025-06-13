import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import { groupExpensesByDate } from "../utils/groupByDate";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Moon, Pencil, PlusIcon, ShoppingBag, Sun, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);


const HomeScreen = () => {
  const { expenses, deleteExpense } = useExpenses();
  const grouped = groupExpensesByDate(expenses);
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  const [balance, setBalance] = useState(0)

  useEffect(()=>{
    const data = localStorage.getItem("balance_saldo")
    setBalance(JSON.parse(data))
  }, [])

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const updateBalanceAfterDelete = (amount) => {
    const updatedBalance = balance + parseFloat(amount);
    setBalance(updatedBalance);
    localStorage.setItem("balance_saldo", String(updatedBalance));
  };

  const handleDelete = (id) => {
    const exp = expenses.find((e)=>e.id === id)
    toast(`Yakin mau dihapus ni?`, {
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            deleteExpense(id);
            updateBalanceAfterDelete(exp.amount)
            toast.success("Pengeluaran berhasil dihapus");
          } catch {
            toast.error("Gagal menghapus pengeluaran");
          }
        },
      },
    });
  };

  return (
    <>
    <title>HomePage</title>
    <div
      className="p-4 max-w-4xl mx-auto transition-colors"
      style={{ color: "var(--custom-12)" }}
    >
      {/* Toggle Theme */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="p-2 rounded-full transition"
          style={{
            backgroundColor: "var(--custom-3)",
            color: "var(--custom-12)",
          }}
        >
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>

      {/* Heading */}
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4 text-center">
        <ShoppingBag /> Pengeluaran Saya
      </h1>

      {/* Summary Cards */}
      <div className="mb-6 grid sm:grid-cols-2 gap-4">
        <div
          className="p-4 rounded-xl shadow transition"
          style={{
            backgroundColor: "var(--custom-5)",
            color: "var(--custom-12)",
          }}
        >
          <h2 className="text-sm">Total Pengeluaran</h2>
          <p className="text-xl font-semibold text-red-500">
            {formatRupiah(total)}
          </p>
        </div>
        <div
          className="p-4 rounded-xl shadow transition"
          style={{
            backgroundColor: "var(--custom-5)",
            color: "var(--custom-12)",
          }}
        >
          <h2 className="text-sm text-[--gray-10]">Saldo Saat Ini</h2>
          <p className="text-xl font-semibold text-green-500">
            {formatRupiah(balance)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={() => navigate("/form")}
          className="flex items-center gap-2 px-4 py-2 rounded transition hover:brightness-110"
          style={{
            backgroundColor: "var(--custom-6)",
            color: "var(--custom-12)",
          }}
        >
          <PlusIcon /> Tambah
        </button>
        <button
          onClick={() => navigate("/balance")}
          className="px-4 py-2 rounded shadow transition"
          style={{
            backgroundColor: "var(--custom-6)",
            color: "var(--custom-12)",
          }}
        >
          Saldo
        </button>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <p className="text-center">Belum ada pengeluaran.</p>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[--gray-10]">{date}</h2>
            <div className="space-y-3">
              {items.map((exp) => {
                const IconComponent = LucideIcons[exp.icon] || ShoppingBag;

                return (
                  <div
                    key={exp.id}
                    className="flex justify-between items-center p-4 rounded-xl shadow hover:shadow-md transition"
                    style={{ backgroundColor: "var(--custom-2)", color: "var(--custom-12)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-[--gray-10]">
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm text-[--gray-10]">{exp.category}</p>
                        {exp.note && (
                          <p className="text-sm italic text-[--gray-9]">"{exp.note}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-500">
                        {formatRupiah(exp.amount)}
                      </p>
                      <div className="flex justify-end mt-2 gap-2">
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              onClick={() => navigate(`/edit/${exp.id}`)}
                              className="text-blue-500 hover:text-blue-700 transition"
                            >
                              <Pencil size={18} />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="top"
                              className="bg-black text-white text-xs px-2 py-1 rounded"
                            >
                              Edit
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>

                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              onClick={() => handleDelete(exp.id)}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="top"
                              className="bg-black text-white text-xs px-2 py-1 rounded"
                            >
                              Hapus
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default HomeScreen;
