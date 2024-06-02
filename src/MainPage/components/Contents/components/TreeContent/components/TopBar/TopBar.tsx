import { useMain, useUser } from "StateProvider";
import React from "react";
import { ZoomButton } from "./components";

export interface Props {
  style?: Object,
}

export const TopBar = ({style}: Props) => {
  const [{activeGroup}, ] = useMain();
  const [{user}, ] = useUser();

  const handleShareClick = (e: React.MouseEvent) => {
    if(!user) return;
    navigator.clipboard.writeText(
      `${window.location.protocol}'//'${window.location.host}/${activeGroup?.id}?share=${user.uid}`
    );
  }

  return (
    <div className="d-flex w-100 justify-content-between p-2" style={style}>
      <p>{activeGroup?.name}</p>
    </div>
  )
}