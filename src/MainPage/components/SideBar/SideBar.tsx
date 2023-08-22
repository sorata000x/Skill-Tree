import React, { useState } from "react";
import "./SideBar.css";
import {
  ActionButtons,
  GroupTabs,
  OpenSideBarButton,
  UserMenu,
  NewGroupButton,
} from "./components";
import { useStateValue } from "StateProvider";

export const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [{groups}, ] = useStateValue();

  return open ? (
    <div className="side_bar">
      <ActionButtons close={()=>setOpen(false)} openUserMenu={()=>setUserMenuOpen(true)} />
      <UserMenu open={userMenuOpen} close={() => setUserMenuOpen(false)} />
      <GroupTabs />
      <NewGroupButton groups={groups} />
    </div>
  ) : (
    <OpenSideBarButton handleClick={() => setOpen(true)} />
  );
};
