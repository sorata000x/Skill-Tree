import "./NodeButton.css";
import React, { createRef, useEffect, useState } from "react";
import { useStateValue } from "StateProvider";
import { Skill } from "types";
import { NodeTitle, SkillPreview } from "./components";

export interface Props {
  skill: Skill;
  buttonRef: React.RefObject<HTMLButtonElement>;
  listeners: any;
  isDragOverlay?: boolean;
}

export const NodeButton = ({
  skill,
  buttonRef,
  listeners,
  isDragOverlay,
}: Props) => {
  const [{ activeSkill }, dispatch] = useStateValue();
  const [isActive, setActive] = useState(false);
  const [isMouseOver, setMouseOver] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [timer, setTimer] = useState(setTimeout(() => {}, 0));

  useEffect(() => {
    setActive(activeSkill?.id === skill.id); // Update active
  }, [activeSkill, skill]);

  const handleClick = (e: Event) => {
    if (isDragOverlay) {
      return;
    }
    e.stopPropagation();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: skill,
    });
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    setMouseOver(true);
    setTimer(
      setTimeout(() => {
        setOpenPreview(true);
      }, 10000)
    );
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    setMouseOver(false);
    setOpenPreview(false);
    clearTimeout(timer);
  };

  return (
    <div
      className="node_button"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <button
        className={isActive ? " active" : ""}
        ref={buttonRef}
        onClick={handleClick}
        {...listeners}
      >
        {skill.image ? <img alt="skill image" src={skill.image} /> : null}
      </button>
      <NodeTitle
        skill={skill}
        listeners={listeners}
        isDragOverlay={isDragOverlay}
      />
      <SkillPreview open={isMouseOver} skill={skill} />
    </div>
  );
};
