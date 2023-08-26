import "./PopUps.css";
import React from "react";
import { useStateValue } from "StateProvider";
import { MoreMenu, UserAuthDialog, SupportPage } from "./components";

export const PopUps = () => {
  const [{ popUp }, dispatch] = useStateValue();

  const handleOnClick = (e: React.MouseEvent) => {
    dispatch({
      type: "CLOSE_POP_UP",
    });
  };

  return popUp ? (
    <div
      className={`pop_ups ${popUp?.focus ? ' focus' : ''}`}
      onMouseDown={handleOnClick}
    >
      <UserAuthDialog />
      <MoreMenu />
      <SupportPage />
    </div>
  ) : null;
};
