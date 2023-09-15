import React from "react";
import "./LevelChangeButtons.css";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

export interface Props {
  level: number;
  maxLevel: number;
  increaseBy: number;
  setLevel: Function;
}

/**
 * Buttons to increase or decrease the skill level
 * Show only if maxLevel > 0
 */
export const LevelChangeButtons = ({
  level,
  maxLevel,
  increaseBy,
  setLevel,
}: Props) => {

  const increaseLevel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let newLevel = level + increaseBy;
    if (newLevel <= maxLevel) {
      setLevel(newLevel);
    } else {
      setLevel(maxLevel);
    }
  };

  const decreaseLevel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let newLevel = level - increaseBy;
    if (newLevel >= 0) {
      setLevel(newLevel);
    } else {
      setLevel(0);
    }
  };

  return ( maxLevel ?
    <div className="level_change_buttons">
      <button
        className="top"
        aria-label="increase level"
        onClick={(e) => increaseLevel(e)}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <HiOutlinePlus className="icon" size={28} />
      </button>
      <div className="divider" />
      <button
        className="bottom"
        aria-label="decrease level"
        onClick={(e) => decreaseLevel(e)}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <HiOutlineMinus className="icon" size={28} />
      </button>
    </div> : null
  );
};
