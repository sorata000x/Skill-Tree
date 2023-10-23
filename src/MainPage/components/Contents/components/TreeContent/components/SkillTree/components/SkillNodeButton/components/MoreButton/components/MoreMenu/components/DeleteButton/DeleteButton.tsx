import "./DeleteButton.css";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { DeleteMenu } from "./components";
import { Skill } from "types";

export interface Props {
  skill: Skill,
}

export const DeleteButton = ({skill}: Props) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <button 
      onMouseEnter={(e)=>setOpenMenu(true)}
      onMouseLeave={(e)=>setOpenMenu(false)}
    >
      <FaRegTrashAlt size={30} />
      Delete
      <div style={{width: '100%'}} />
      <RiArrowRightSLine size={30} />
      { openMenu ? <DeleteMenu skill={skill} /> : null}
    </button>
  )
}