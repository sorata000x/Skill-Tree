import "./SideBar.css";
import React, { useState } from "react";
import {
  UserButton,
  CloseSideBarButton,
  GroupTabs,
  OpenSideBarButton,
  UserMenu,
  NewGroupButton,
  CommunityTabs,
} from "./components";
import { useStateValue } from "StateProvider";

/**
 * Side bar on the left side of the page contains utilities including:
 * - OpenSideBarButton  | open side bar              (show if side bar is closed)
 * - CloseSideBarButton | close side bar             (top right)
 * - UserButton         | open user menu             (top left)
 * - UserMenu           | change theme, login/logout (show if user button clicked)
 * - GroupTabs          | group tabs                 (middle)
 * - NewGroupButton     | add a new group tab        (bottom)
 */
export const SideBar = () => {
  const [{ groups }] = useStateValue();
  const [open, setOpen] = useState(true); // control itself to open or close
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return open ? (
    <div className="side_bar">
      <div className="button_group_top">
        <UserButton handleClick={() => setUserMenuOpen(true)} />
        <CloseSideBarButton handleClick={() => setOpen(false)} />
      </div>
      <UserMenu open={userMenuOpen} close={() => setUserMenuOpen(false)} />
      <CommunityTabs />
      <GroupTabs />
      <NewGroupButton groups={groups} />
    </div>
  ) : (
    <OpenSideBarButton handleClick={() => setOpen(true)} />
  );
};
