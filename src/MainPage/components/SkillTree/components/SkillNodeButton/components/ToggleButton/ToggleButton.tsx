import { useStateValue } from "StateProvider";
import "./ToggleButton.css";
import React, { useEffect, useState } from "react";
import { Skill } from "types";
import { CgMoreAlt, CgMore } from "react-icons/cg";
import { BsDot } from "react-icons/bs";
import { PiDotsThreeOutlineThin, PiDotsThreeOutlineFill } from "react-icons/pi"

// Reference: stackoverflow: React won't load local images | https://stackoverflow.com/questions/34582405/react-wont-load-local-images

export interface Props {
  skill: Skill,
}

export const ToggleButton = ({skill}: Props) => {
  const [{skills}, dispatch] = useStateValue();
  const [isMouseOver, setMouseOver] = useState(false);

  const toggleTree = () => {
    dispatch({
      type: "SET_SKILL_TREE_OPEN",
      id: skill.id,
      treeOpen: skill.treeOpen ? false : true,
    })
  }

  const skillHasChildren = () => {
    for(const s of skills) {
      if (s.parent === skill.id) return true;
    }
    return false;
  }

  const dotIcons = () => {
    let iconName = '';
    if(!isMouseOver) {
      iconName = skill.treeOpen ? 'dot-outlined' : 'dot-filled';
    } else {
      iconName = skill.treeOpen ? 'dot-outlined-hover' : 'dot-filled-hover';
    }
    return (
      <div className="dot_icons">
        { Array(3).fill(1).map(() => (
          <img 
            alt="toggle" 
            src={require(`images/${iconName}.png`)} />
        )) }
      </div>
    )
  }

  return (
    skillHasChildren() ? 
    <button 
      className="toggle_button" 
      onClick={()=>toggleTree()} 
      onMouseOver={()=>setMouseOver(true)}
      onMouseOut={()=>setMouseOver(false)}>
      {dotIcons()}
    </button> : null
  )
}