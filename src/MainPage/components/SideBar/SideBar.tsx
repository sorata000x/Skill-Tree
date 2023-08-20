import React, { useState } from "react";
import "./SideBar.css";
import {
  ActionButtons,
  GroupTabs,
  OpenSideBarButton,
  UserButton,
  UserMenu,
} from "./components";

export const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return open ? (
    <div className="side_bar">
      <ActionButtons close={() => setOpen(false)} />
      <GroupTabs />
      <UserButton handleClick={() => setUserMenuOpen(true)} />
      <UserMenu open={userMenuOpen} close={() => setUserMenuOpen(false)} />
    </div>
  ) : (
    <OpenSideBarButton handleClick={() => setOpen(true)} />
  );
};
