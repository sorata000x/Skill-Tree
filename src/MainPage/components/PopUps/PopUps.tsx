import "./PopUps.css";
import React from "react";
import { useStateValue } from "StateProvider";
import { MoreMenu, UserAuthDialog } from "./components";

export const PopUps = () => {
  const [{ popUp }, dispatch] = useStateValue();

  const handleOnClick = (e: React.MouseEvent) => {
    dispatch({
      type: "CLOSE_POP_UP",
    });
  };

  return popUp ? (
    <div
      style={
        popUp.type === "user_auth_dialog"
          ? { backgroundColor: "rgba(70, 70, 70, 0.8)" }
          : {}
      }
      className="pop_ups"
      onClick={handleOnClick}
    >
      <UserAuthDialog />
      <MoreMenu />
    </div>
  ) : null;
};
