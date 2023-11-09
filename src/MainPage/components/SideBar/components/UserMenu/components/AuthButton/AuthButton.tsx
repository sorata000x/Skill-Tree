import { useMain, useUser } from "StateProvider";
import React from "react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { UserAuthDialog } from "./components";
import { auth } from "_firebase";
import { useNavigate } from "react-router-dom";

export interface Props {
  onClick: (e: React.MouseEvent) => void;
}

/**
 * Authentication button (login / logout)
 */
export const AuthButton = ({ onClick }: Props) => {
  const [{ user }, dispatchUser] = useUser();
  const [, dispatchMain] = useMain();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    onClick(e);
    // Logout or login / sing up
    if (user) {
      auth.signOut();
      dispatchUser({
        type: "SIGN_OUT",
      });
      navigate("/");
    } else {
      dispatchMain({
        type: "SET_POP_UP",
        popUp: <UserAuthDialog />,
      });
    }
  };

  return (
    <button onClick={(e) => handleClick(e)}>
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
  );
};
