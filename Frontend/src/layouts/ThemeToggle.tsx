import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "cupcake"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "cupcake" : "dark")}
      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all"
    >
      {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
