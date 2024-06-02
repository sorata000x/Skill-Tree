import React, { useState } from "react";
import {
  UserButton,
  CloseSideBarButton,
  GroupTabs,
  OpenSideBarButton,
  UserMenu,
  NewGroupButton,
  ActionButton,
} from "./components";
import { useMain, useUser } from "StateProvider";

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
  const [{ groups }] = useUser();
  const [{}, dispatchMain] = useMain();
  const [open, setOpen] = useState(true); // control itself to open or close
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleOpen = (open: boolean) => {
    setOpen(open);
    dispatchMain({
      type: "SET_SIDE_BAR_OPEN",
      sideBarOpen: open,
    })
  }

  return open ? (
    <div className="d-flex flex-column bg-secondary flex-shrink-0" 
      style={{width: "308px", flexShrink: "0"}}>
      <div className="d-flex gap-1 m-2">
        <UserButton handleClick={()=>setUserMenuOpen(true)} />
        <CloseSideBarButton handleClick={()=>toggleOpen(false)} />
      </div>
      <UserMenu open={userMenuOpen} close={()=>setUserMenuOpen(false)} />
      <GroupTabs />
      <NewGroupButton groups={groups} />
    </div>
  ) : (
    <OpenSideBarButton handleClick={() => toggleOpen(true)} />
  );
};
