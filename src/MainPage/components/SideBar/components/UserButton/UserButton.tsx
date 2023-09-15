import React from "react";
import "./UserButton.css";
import { useStateValue } from "StateProvider";

export interface Props {
  handleClick: (e: React.MouseEvent) => void;
}

/**
 * Display user email address or 'Guest' if not logged in
 * Note: Consider changing displaying user name instead of email address
 */
export const UserButton = ({ handleClick }: Props) => {
  const [{ user }] = useStateValue();

  return (
    <button className="user_button" onClick={handleClick}>
      {user ? user.email : "Guest"}
    </button>
  );
};
