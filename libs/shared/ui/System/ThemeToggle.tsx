"use client";
import { capitalize } from "@core/common";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTheme = (e) => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="form-control">
      <label className="label  cursor-pointer">
        <span className="label-text   mr-2 whitespace-nowrap text-sm">{capitalize(theme ?? "")}</span>
        <input type="checkbox" className="toggle toggle-sm " checked={theme === "dark"} onChange={handleTheme} />
      </label>
    </div>
  );
};
