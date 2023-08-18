import React from "react";
import "./LevelChangeButtons.css";
import { useStateValue } from "StateProvider";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { Skill } from "types.js";

export interface Props {
  level: number;
  maxLevel: number;
  increaseBy: number;
  setLevel: Function;
}

export const LevelChangeButtons = ({
  level,
  maxLevel,
  increaseBy,
  setLevel,
}: Props) => {
  const [, dispatch] = useStateValue();

  const increaseLevel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    //e.stopPropagation();
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
    //e.stopPropagation();
    let newLevel = level - increaseBy;
    if (newLevel >= 0) {
      setLevel(newLevel);
    } else {
      setLevel(0);
    }
  };

  return (
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
      <div className="curv"></div>
    </div>
  );
};
