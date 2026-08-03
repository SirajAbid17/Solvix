import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../BgContext/ThemeContext";
import { MdOutlineBrightnessHigh } from "react-icons/md";

export default function BgContextBtn() {
  const { dark, setDark } = useTheme();

  return (
    <div>
      <button className="mt-1" onClick={() => setDark(!dark)}>
        {dark ? <MdOutlineBrightnessHigh size={24} /> : <MdDarkMode size={24} />}
      </button>
    </div>
  );
}