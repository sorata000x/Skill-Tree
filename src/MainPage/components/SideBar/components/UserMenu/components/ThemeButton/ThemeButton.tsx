import { useStateValue } from "StateProvider";
import "./ThemeButton.css";
import React from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export interface Props {
  onClick: (e: React.MouseEvent) => void;
}

/**
 * Theme control button (light / dark)
 */
export const ThemeButton = ({ onClick }: Props) => {
  const [{ theme }, dispatch] = useStateValue();

  // Switch theme to light (default) or dark mode
  const handleClick = (e: React.MouseEvent) => {
    dispatch({
      type: "SET_THEME",
      theme: theme === "light" ? "dark" : "light",
    });
    onClick(e);
  };

  return (
    <button onClick={handleClick}>
      {theme === "light" ? (
        <>
          <MdOutlineDarkMode />
          Dark Mode
        </>
      ) : (
        <>
          <MdOutlineLightMode />
          Light Mode
        </>
      )}
    </button>
  );
};
