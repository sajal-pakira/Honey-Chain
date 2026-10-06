"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        group
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-white/15
        bg-black/30
        text-white
        backdrop-blur-xl
        transition-all
        duration-200
        hover:border-amber-400/50
        hover:bg-amber-400/10
        hover:text-amber-300
      "
    >
      {theme === "dark" ? (
        <Sun
          size={17}
          strokeWidth={1.8}
          className="transition-transform duration-300 group-hover:rotate-45"
        />
      ) : (
        <Moon
          size={17}
          strokeWidth={1.8}
          className="transition-transform duration-300 group-hover:-rotate-12"
        />
      )}
    </button>
  );
}