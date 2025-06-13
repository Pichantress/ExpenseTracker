import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import HomeScreen from "./pages/HomeScreen";
import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { ExpenseProvider } from "./context/ExpenseContext";
import ExpenseFormPage from "./pages/ExpenseForm";
import BalancePage from "./pages/BalancePage";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return (
    <>
      <Theme>
        <BrowserRouter>
          <ExpenseProvider>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/form" element={<ExpenseFormPage />} />
              <Route path="/edit/:id" element={<ExpenseFormPage />} />
              <Route path="/balance" element={<BalancePage />} />
            </Routes>
            <Toaster richColors />
          </ExpenseProvider>
        </BrowserRouter>
      </Theme>
    </>
  );
}

export default App;
