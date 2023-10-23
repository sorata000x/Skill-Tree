import React from "react";
import "./DeleteMenu.css";
import { Skill } from "types";
import { useUser } from "StateProvider";

export interface Props {
  skill: Skill,
}

export const DeleteMenu = ({skill}: Props) => {
  const [{}, dispatch] = useUser();

  return (
    <div
        className="menu delete_menu"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={(e)=>dispatch({type: "DELETE_SKILL", id: skill.id})}>
          Delete Node
        </button>
        <button onClick={(e)=>dispatch({type: "DELETE_TREE", id: skill.id})}>
          Delete Tree
        </button>
      </div>
  )
}