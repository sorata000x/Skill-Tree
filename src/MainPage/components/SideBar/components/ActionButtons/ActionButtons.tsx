import React from "react";
import { CloseSideBarButton, UserButton } from "./components";
import { useStateValue } from "StateProvider";
import "./ActionButtons.css";

export interface Props {
  close: Function;
  openUserMenu: Function;
}

export const ActionButtons = ({ close, openUserMenu }: Props) => {
  const [{ groups }] = useStateValue();

  return (
    <div className="action_buttons">
      <UserButton handleClick={()=>openUserMenu()} />
      <CloseSideBarButton handleClick={close} />
    </div>
  );
};
