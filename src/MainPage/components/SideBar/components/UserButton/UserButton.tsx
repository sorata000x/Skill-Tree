import React, { useState } from "react";
import "./UserButton.css";
import { useStateValue } from "StateProvider";

export interface Props {
  handleClick: (e: React.MouseEvent)=>void;
}

export const UserButton = ({handleClick}: Props) => {
  const [{user}] = useStateValue();

  return (
    <button className="user_button" onClick={handleClick}>
      {user ? user.email : "Guest"}
    </button>
  );
};
