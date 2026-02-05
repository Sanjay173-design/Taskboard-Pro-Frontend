import { useEffect, useState } from "react";

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    console.log("THEME:", dark ? "dark" : "light");
  }, [dark]);

  return {
    dark,
    toggleTheme: () => setDark((prev) => !prev),
  };
}
