import React, { useState } from "react";
import "./UserAuthDialog.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "firebase.ts";
import { useNavigate } from "react-router-dom";
import { AuthFormContext } from "./components";
import { useStateValue } from "StateProvider";

/**
 * User authentication (login / sign up) dialog window
 * - AuthFormContext | inputs and subtext components
 */
export const UserAuthDialog = () => {
  const [{}, dispatch] = useStateValue();
  const [type, setType] = useState("login");
  const navigate = useNavigate();

  const close = () => {
    dispatch({
      type: "CLOSE_POP_UP"
    })
  }

  const changeType = (e: React.MouseEvent) => {
    e.preventDefault();
    setType(type === "login" ? "sign-up" : "login");
  };

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    // Firebase login
    // Reference: Get form data in React | https://stackoverflow.com/questions/23427384/get-form-data-in-react
    signInWithEmailAndPassword(
      auth,
      (e.target as HTMLFormElement).email.value,
      (e.target as HTMLFormElement).password.value
    )
      .then((auth) => {
        close();
      })
      .catch((error) => alert(error.message));
  };

  const register = (e: React.FormEvent<HTMLFormElement>) => {
    // Firebase register
    createUserWithEmailAndPassword(
      auth,
      (e.target as HTMLFormElement).email.value,
      (e.target as HTMLFormElement).password.value
    )
      .then((auth) => {
        // successfully created a new user with email and password
        if (auth) {
          close();
          navigate("/");
        }
      })
      .catch((error) => alert(error.message));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    type === "login" ? signIn(e) : register(e);
  };

  return (
    <div className="dark_overlay" onClick={(e)=>close()}>
      <div className="user_auth_dialog" onClick={(e)=>e.stopPropagation()}>
        <div className="title">
          {type === "login" ? "Sign In" : "Create Your Account"}
        </div>
        <form className="dialog_form" onSubmit={handleSubmit}>
          <AuthFormContext type={type} changeType={changeType} />
          <button className="submit" type="submit">
            {type === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};
