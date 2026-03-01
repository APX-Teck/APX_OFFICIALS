"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />; // placeholder

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <Moon size={20} className="text-white" />
      ) : (
        <Sun size={20} className="text-black" />
      )}
    </button>
  );
}
