import React from "react";
import { NewGroupButton, CloseSideBarButton } from "./components";
import { useStateValue } from "StateProvider";
import "./ActionButtons.css";

export interface Props {
  close: Function,
}

export const ActionButtons = ({close}: Props) => {
  const [{groups}, ] = useStateValue();

  return (
    <div className="action_buttons">
      <NewGroupButton groups={groups} />
      <CloseSideBarButton handleClick={close} />
    </div>
  )
}