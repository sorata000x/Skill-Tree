import React from "react";
import { useStateValue } from "StateProvider";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { Skill } from "types.js";

export interface Props {
  skill: Skill,
}

export const LevelChangeButtons = ({skill}: Props) => {

  const [, dispatch] = useStateValue();

  // Set the level of the skill for this button.
  const setLevel = (level: number) => {
    skill.level = level;
    dispatch({
      type: "SET_SKILL",
      id: skill.id,
      skill: skill,
    });
  };

  const increaseLevel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    let level = skill.level + skill.increaseBy;
    if (level <= skill.maxLevel) {
      setLevel(level);
    } else {
      setLevel(skill.maxLevel);
    }
  };

  const decreaseLevel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    let level = skill.level - skill.increaseBy;
    if (level >= 0) {
      setLevel(level);
    } else {
      setLevel(0);
    }
  };

  return (
    <div className="level_change_container">
      <button
        title="increase level"
        className="level_change_button"
        onClick={(e) => increaseLevel(e)}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <HiOutlinePlus className="level_change_icon" size={28} />
      </button>
      <div className="level_change_divider" />
      <button
        title="decrease level"
        className="level_change_button"
        onClick={decreaseLevel}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <HiOutlineMinus className="level_change_icon" size={28} />
      </button>
    </div>
  );
};
