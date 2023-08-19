import React, { useState } from "react";
import "./SideBar.css";
import {
  ActionButtons,
  GroupTabs,
  OpenSideBarButton,
  UserButton,
} from "./components";

export const SideBar = () => {
  const [open, setOpen] = useState(true);

  return open ? (
    <div className="side_bar">
      <ActionButtons close={() => setOpen(false)} />
      <GroupTabs />
      <UserButton />
    </div>
  ) : (
    <OpenSideBarButton handleClick={() => setOpen(true)} />
  );
};
