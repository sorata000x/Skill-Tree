import { useStateValue } from "StateProvider";
import "./ToggleButton.css";
import React, { useEffect, useState } from "react";
import { Skill } from "types";
import { DotFilled, DotOutlined } from "./components";

// Reference: stackoverflow: React won't load local images | https://stackoverflow.com/questions/34582405/react-wont-load-local-images

export interface Props {
  skill: Skill;
}

/**
 * Button to toggle skill tree
 */
export const ToggleButton = ({ skill }: Props) => {
  const [{ skills }, dispatch] = useStateValue();
  const [isMouseOver, setMouseOver] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    let count = 0;
    for (const s of skills) {
      if (s.parent === skill.id) count++;
    }
    setChildrenCount(count);
  }, [skills])

  const toggleTree = () => {
    dispatch({
      type: "SET_SKILL_TREE_OPEN",
      id: skill.id,
      treeOpen: skill.treeOpen ? false : true,
    });
  };

  const DotIcons = () => {
    let dots;
    if(childrenCount >= 3) {
      dots = <>
      {skill.treeOpen ? <DotOutlined hover={isMouseOver} style={{transform: "translateY(-6px)"}} /> : <DotFilled hover={isMouseOver} style={{transform: "translateY(-6px)"}} />}
      {skill.treeOpen ? <DotOutlined hover={isMouseOver} /> : <DotFilled hover={isMouseOver}/>}
      {skill.treeOpen ? <DotOutlined hover={isMouseOver} style={{transform: "translateY(-6px)"}} /> : <DotFilled hover={isMouseOver} style={{transform: "translateY(-6px)"}} />}
      </>
    } else if (childrenCount === 2) {
      dots = <>
      {skill.treeOpen ? <DotOutlined hover={isMouseOver} style={{transform: "translateY(-2px)"}} /> : <DotFilled hover={isMouseOver} style={{transform: "translateY(-2px)"}} />}
      {skill.treeOpen ? <DotOutlined hover={isMouseOver} style={{transform: "translateY(-2px)"}} /> : <DotFilled hover={isMouseOver} style={{transform: "translateY(-2px)"}} />}
      </>
    } else if (childrenCount === 1) {
      dots = skill.treeOpen ? <DotOutlined hover={isMouseOver}/> : <DotFilled hover={isMouseOver}/>
    }

    return (
      <div className="dot_icons">
        {dots}
      </div>
    );
  };

  return childrenCount ? (
    <button
      className="toggle_button"
      onClick={(e) => {toggleTree(); e.stopPropagation()}}
      onDoubleClick={(e) => e.stopPropagation()}
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      onMouseLeave={() => setMouseOver(false)}
      onMouseDown={(e)=>e.stopPropagation()}
    >
      {DotIcons()}
    </button>
  ) : null;
};
