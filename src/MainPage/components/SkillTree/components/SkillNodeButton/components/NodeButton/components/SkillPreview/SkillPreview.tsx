import "./SkillPreview.css";
import React, { useState, createRef, useEffect } from "react";
import type { Skill } from "types";
import { getOffset } from "utilities";

export interface Props {
  open: boolean;
  skill: Skill;
}

export const SkillPreview = ({ open, skill }: Props) => {
  const [isMouseOver, setMouseOver] = useState(false);
  const ref: React.RefObject<HTMLDivElement> = createRef();

  // Adjust position to fit to screen
  useEffect(() => {
    let offset = getOffset(ref);
    if (!offset || !ref.current) return;
    // default position (on the left)
    ref.current.style.transform = "translate(calc(-100% + 20px), calc(50% - 48px))";  
    let [translateX, translateY] = ["calc(-100% + 20px)", "calc(50% - 48px)"];
    // if no space on the left, move to right
    if (offset.left < 0) {
      translateX = "calc(120px)";
    }
    // if no space on the bottom, move up
    const SCROLL_BAR_HEIGHT = 10;
    if (offset.top + offset.height + SCROLL_BAR_HEIGHT > window.innerHeight) { 
      let dy = offset.top + offset.height + SCROLL_BAR_HEIGHT - window.innerHeight;
      translateY = `calc(50% - 48px - ${dy}px)`;
    }
    // if no space on the top, move down
    if (offset.top < 0) {
      let dy = -offset.top;
      translateY = `calc(50% - 48px + ${dy + 10}px)`;
    }
    ref.current.style.transform = `translate(${translateX}, ${translateY})`;
  }, [ref])

  const handleMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMouseOver(true);
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMouseOver(false);
  }
  
  return (open || isMouseOver) ? (
    <div
      className="skill_preview fade-in"
      onMouseOver={(e) => handleMouseOver(e)}
      onMouseLeave={(e) => handleMouseLeave(e)}
      ref={ref}
    >
      <div className="container">
        <div className="info_group">
          <div className="label">Title</div>
          <div className="value">{skill.title}</div>
        </div>
        <div className="info_group">
          <div className="label">Level</div>
          <div className="value">{skill.level} / {skill.maxLevel}</div>
        </div>
        <div className="info_group">
          <div className="label">Description</div>
          <div className="value">{skill.description}</div>
        </div>
      </div>
    </div>
  ) : null;
};
