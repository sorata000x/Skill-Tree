import "./UserMenu.css";
import React, { createRef, useEffect } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useStateValue } from "StateProvider";
import { auth } from "firebase.ts";
import { useNavigate } from "react-router-dom";

export interface Props {
  open: boolean;
  close: Function;
}

export const UserMenu = ({ open, close }: Props) => {
  const [{ user, theme }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const ref: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
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

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "SIGN_OUT",
      });
      navigate("/");
    } else {
      dispatch({
        type: "SET_POP_UP",
        popUp: { 
          type: "user_auth_dialog",
          focus: true,
        },
      });
    }
    close();
  };

  const switchTheme = () => {
    dispatch({
      type: "SET_THEME",
      theme: theme === "light" ? "dark" : "light",
    });
    close();
  };

  return open ? (
    <div className="user_menu" ref={ref}>
      <button onClick={() => switchTheme()}>
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
      <button onClick={() => handleAuthentication()}>
        {user ? (
          <>
            <BiLogOut />
            Logout
          </>
        ) : (
          <>
            <BiLogIn />
            Login
          </>
        )}
      </button>
    </div>
  ) : null;
};
