import "./UserMenu.css";
import React, { createRef, useEffect } from "react";
import { ThemeButton, AuthButton } from "./components";

export interface Props {
  open: boolean;
  close: Function;
}

/**
 * A popup menu show under UserButton if clicked
 * - ThemeButton    | change theme (light / dark)
 * - AuthButton     | authentication (logout / open auth dialog if login)
 * - UserAuthDialog | auth button click to close menu and open auth dialog window
 */
export const UserMenu = ({open, close}: Props) => {
  const ref: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
    // Close self if clicked outside
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return open ? 
  <div className="user_menu" ref={ref}>
    <ThemeButton onClick={(e)=>close()} />
    <AuthButton onClick={(e)=>close()} />
  </div> : null;
};
