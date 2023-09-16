import { useStateValue } from "StateProvider";
import "./ToggleButton.css";
import React, { useState } from "react";
import { Skill } from "types";

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

  const skillHasChildren = () => {
    for (const s of skills) {
      if (s.parent === skill.id) return true;
    }
    return false;
  };

  const toggleTree = () => {
    dispatch({
      type: "SET_SKILL_TREE_OPEN",
      id: skill.id,
      treeOpen: skill.treeOpen ? false : true,
    });
  };

  const DotIcons = () => {
    let iconName = "";
    if (!isMouseOver) {
      iconName = skill.treeOpen ? "dot-outlined" : "dot-filled";
    } else {
      iconName = skill.treeOpen ? "dot-outlined-hover" : "dot-filled-hover";
    }
    return (
      <div className="dot_icons">
        {Array(3)
          .fill(1)
          .map(() => (
            <img alt="toggle" src={require(`images/${iconName}.png`)} />
          ))}
      </div>
    );
  };

  return skillHasChildren() ? (
    <button
      className="toggle_button"
      onClick={() => toggleTree()}
      onDoubleClick={(e) => e.stopPropagation()}
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
    >
      {DotIcons()}
    </button>
  ) : null;
};
