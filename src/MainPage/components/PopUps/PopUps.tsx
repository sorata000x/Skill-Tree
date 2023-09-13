import "./PopUps.css";
import React from "react";
import { useStateValue } from "StateProvider";
import { MoreMenu, UserAuthDialog, SupportPage, UpdateLog, ImageEdit } from "./components";

export const PopUps = () => {
  const [{ popUp, activeSkill }, dispatch] = useStateValue();

  const close = () => {
    dispatch({
      type: "CLOSE_POP_UP",
    });
  }

  const handleOnClick = (e: React.MouseEvent) => {
    dispatch({
      type: "CLOSE_POP_UP",
    });
  };

  if (!popUp) return; 

  return (
    <div
      className={`pop_ups ${popUp?.focus ? ' focus' : ''}`}
      onClick={(e)=>close()}
      >
      <div onClick={(e)=>e.stopPropagation()}>
        <UserAuthDialog />
        <MoreMenu />
        <SupportPage />
        <UpdateLog />
        <ImageEdit 
          open={popUp?.type === "image_edit"} 
          close={close} 
          />
      </div>
    </div>
  );
};
