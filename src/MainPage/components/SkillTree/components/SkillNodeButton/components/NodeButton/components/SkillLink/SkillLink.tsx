import { Skill } from "types";
import "./SkillLink.css";
import React, { useState, useEffect } from "react";
import { useStateValue } from "StateProvider";

export interface Props {
  skill: Skill,
}

export const SkillLink = ({skill}: Props) => {
  const [{buttons, dragOverlay}, ] = useStateValue();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!dragOverlay.skills) return;  // Only updates when dragging
    // Update every 0 ms
    const interval = setInterval(() => setTime(new Date()), 0);
    return () => {
      clearInterval(interval);
    };
  });

  // Update the positon of the links between the nodes
  const getLink = () => {
    if (
      !buttons[skill.id] ||
      !buttons[skill.parent] ||
      !buttons[skill.id].current ||
      !buttons[skill.parent].current
    )
      return;

    /**
     * Get offsets of given element (for updateChildEdge).
     * Reference: How to Draw a Line Between Two divs with JavaScript? | https://thewebdev.info/2021/09/12/how-to-draw-a-line-between-two-divs-with-javascript/
     */
    const getOffset = (el: React.RefObject<HTMLButtonElement>) => {
      const rect = el.current?.getBoundingClientRect();
      if (!rect) return;
      return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width,
        height: rect.height,
      };
    };
    const off_p = getOffset(buttons[skill.parent]);
    const off_n = getOffset(buttons[skill.id]);
    if (!off_p || !off_n) return;
    const length = Math.sqrt(
      (off_p.left - off_n.left) * (off_p.left - off_n.left) +
        (off_p.top - off_n.top) * (off_p.top - off_n.top)
    );
    const angle =
      Math.atan2(off_p.top - off_n.top, off_p.left - off_n.left) *
      (180 / Math.PI);
    return (
      <div
        className="link"
        style={{
          width: length,
          left: '56px',
          top: '70px',
          transform: `rotate(${angle}deg)`,
          transformOrigin: "top left",
        }}
      />
    );
  };

  return ( getLink() )
}