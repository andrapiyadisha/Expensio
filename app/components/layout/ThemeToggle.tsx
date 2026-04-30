"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark-theme";
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(savedTheme);
    setDark(savedTheme === "dark-theme");
  }, []);

  const toggleTheme = () => {
    const newTheme = dark ? "light-theme" : "dark-theme";
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setDark(!dark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle Theme"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
