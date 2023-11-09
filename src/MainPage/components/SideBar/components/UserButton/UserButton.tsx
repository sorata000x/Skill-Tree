import React from "react";
import { useUser } from "StateProvider";

export interface Props {
  handleClick: (e: React.MouseEvent) => void;
}

/**
 * Display user email address or 'Guest' if not logged in
 * Note: Consider changing displaying user name instead of email address
 */
export const UserButton = ({ handleClick }: Props) => {
  const [{ user }] = useUser();

  return (
    <button className="btn w-100 btn-primary" onClick={handleClick}>
      {user ? user.email : "Guest"}
    </button>
  );
};
