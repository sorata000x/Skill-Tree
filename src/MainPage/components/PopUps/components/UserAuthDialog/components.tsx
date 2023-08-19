import "./components.css"
import React from "react";
import { useStateValue } from "StateProvider";

export const EmailInput = () => {
  return (
    <div className="text_field">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
      />
    </div>
  )
}

export const PasswordInput = () => {
  return (
    <div className="text_field">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="off"
      />
    </div>
  )
}

export const HaveAccountOrText = (
  {type, changeType}: 
  {type: string, changeType: (e: React.MouseEvent)=>void}) => {
  return (
    <div className="have_account_or">
      {type === "login"
        ? `Don't have an account?`
        : `Already have an account?`}
      {type === "login" ? (
        <button className="text_button" onClick={changeType}>
          Sign Up
        </button>
      ) : (
        <button className="text_button" onClick={changeType}>
          Login
        </button>
      )}
    </div>
  )
}

export const AuthFormContext = (
  {type, changeType}: 
  {type: string, changeType: (e: React.MouseEvent)=>void}) => {
  return (
    <div className="form_context">
      <EmailInput />
      <PasswordInput />
      <HaveAccountOrText type={type} changeType={changeType} />
    </div>
  )
}
