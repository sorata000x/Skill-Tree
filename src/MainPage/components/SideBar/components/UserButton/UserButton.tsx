import React from "react";
import { useStateValue } from "StateProvider";
import { auth } from "firebase.ts";
import { useNavigate } from "react-router-dom";
import "./UserButton.css";

export const UserButton = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

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
        popUp: {type: 'user_auth_dialog'}
      })
    }
  };

  return (
    <button className="user_button" onClick={handleAuthentication}>
      {user ? user.email : "Login"}
    </button>
  );
};
