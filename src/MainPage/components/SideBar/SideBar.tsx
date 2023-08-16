import React, { useState } from "react";
import "./SideBar.css";
import { ActionButtons, GroupTabs, OpenSideBarButton, UserButton } from "./components";

export interface Props {
  openAuth: Function
}

export const SideBar = ({ openAuth }: Props) => {
  const [open, setOpen] = useState(true);

  return open ? 
    <div className="side_bar">
      <ActionButtons 
        close={()=>setOpen(false)}
      />
      <GroupTabs />
      <UserButton openAuth={openAuth}/>
    </div>
   : 
    <OpenSideBarButton handleClick={()=>setOpen(true)}/>
  ;
}
