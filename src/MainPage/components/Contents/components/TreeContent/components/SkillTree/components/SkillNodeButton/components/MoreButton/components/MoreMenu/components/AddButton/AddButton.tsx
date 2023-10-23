import "./AddButton.css";
import React, { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { RiArrowRightSLine } from "react-icons/ri";
import { AddMenu } from "./components";
import { Skill } from "types";

export interface Props {
  skill: Skill,
}

export const AddButton = ({skill}: Props) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <button 
      onMouseEnter={(e)=>setOpenMenu(true)}
      onMouseLeave={(e)=>setOpenMenu(false)}
    >
      <HiOutlinePlus size={30} />
      Add
      <div style={{width: '100%'}} />
      <RiArrowRightSLine size={30} />
      { openMenu ? <AddMenu skill={skill} /> : null }
    </button>
  )
}