import React from "react";
import "./AddMenu.css";
import { Skill } from "types";
import { useUser } from "StateProvider";

export interface Props {
  skill: Skill,
}

export const AddMenu = ({skill}: Props) => {
  const [{skills}, dispatch] = useUser();

  const addSkill = (pos: string) => {
    let parentID;
    switch(pos) {
      case "child": {
        parentID = skill.id;
        break;
      }
      case "sibling": {
        parentID = skill.parent;
        break;
      }
    }
    if(!parentID) return;
    dispatch({
      type: "ADD_SKILL",
      parentID: parentID,
      group: skill.group,
    });
  }

  return (
    <div
      className="menu add_menu"
      onClick={(e) => e.stopPropagation()}
      >
        <button onClick={(e)=>addSkill('child')}>
          Add Child
        </button>
        <button onClick={(e)=>addSkill('sibling')}>
          Add Sibling
        </button>
      </div>
  )
}