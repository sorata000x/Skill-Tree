import React, { useState } from "react";
import "./UserAuthDialog.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "firebase.ts";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export interface Props {
  open: boolean,
  close: Function,
}

export const UserAuthDialog = ({ open, close }: Props) => {
  const [type, setType] = useState("login");
  const navigate = useNavigate();
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg');

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    //if (!(e.target instanceof HTMLInputElement)) return;
    // firebase login
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
    // firebase register
    createUserWithEmailAndPassword(
      auth,
      (e.target as HTMLFormElement).email.value,
      (e.target as HTMLFormElement).password.value
    )
      .then((auth) => {
        // successfully created a new user with email and password
        if (auth) {
          close();
          navigate('/');
        }
      })
      .catch((error) => alert(error.message));
  };

  const changeType = (e: React.MouseEvent) => {
    e.preventDefault();
    setType(type === "login" ? "sign-up" : "login");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    type === "login" ? signIn(e) : register(e);
  };

  return (
    <Dialog open={open} onClose={()=>close()} maxWidth={maxWidth}>
      <div className="dialog_container">
        <DialogTitle>
          {type === "login" ? "Sign In" : "Create Your Account"}
        </DialogTitle>
        <form className="dialog_form" onSubmit={handleSubmit}>
          <div className="dialog_context">
            <TextField
              name="email"
              variant="outlined"
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              size="small"
              fullWidth
            />
            <TextField
              name="password"
              variant="outlined"
              autoFocus
              margin="dense"
              label="Password"
              type="password"
              size="small"
              fullWidth
            />
            <DialogContentText style={{ marginTop: "10px" }}>
              {type === "login"
                ? `Don't have an account?`
                : `Already have an account?`}
              {type === "login" ? (
                <button className="text_btn" onClick={changeType}>
                  Sign Up
                </button>
              ) : (
                <button className="text_btn" onClick={changeType}>
                  Login
                </button>
              )}
            </DialogContentText>
          </div>
          <DialogActions>
            <Button type="submit" variant="contained">
              OK
            </Button>
            <Button variant="outlined" onClick={()=>close()}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  );
}
