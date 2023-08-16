import React from "react";
import { useStateValue } from "StateProvider";
import { auth } from "firebase.ts";
import { useNavigate } from "react-router-dom";
import "./UserButton.css";

export interface Props {
  openAuth: Function,
}

export const UserButton = ({openAuth}: Props) => {
  const [{user}, dispatch] = useStateValue();
  const navigate = useNavigate();

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "SIGN_OUT",
      });
      navigate('/');
    } else {
      openAuth();
    }
  };

  return (
    <button className="user_button" onClick={handleAuthentication}>
      {user ? user.email : 'Login'}
    </button>
  );
}