import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../BgContext/ThemeContext";

export default function BgContextBtn() {
  const { dark, setDark } = useTheme();

  return (
    <div>
      <button onClick={() => setDark(!dark)}>
        {dark ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
      </button>
    </div>
  );
}