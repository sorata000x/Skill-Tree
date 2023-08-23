import { Skill, Buttons } from "types";
import "./SkillLink.css";
import React, { useState, useEffect } from "react";
import { useStateValue } from "StateProvider";

export interface Props {
  skill: Skill,
  buttons: Buttons,
  isDragOverlay: boolean | undefined,
}

export const SkillLink = ({skill, buttons, isDragOverlay}: Props) => {
  const [{ dragOverlay}, ] = useStateValue();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!dragOverlay.skills.length) return;  // Only updates when dragging
    // Update every 0 ms
    const interval = setInterval(() => setTime(new Date()), 0);
    return () => {
      clearInterval(interval);
    };
  });

  // Update the positon of the links between the node and its parent
  const getLink = () => {
    const isDragOverlayRoot = isDragOverlay && skill.parent === 'root';  // connect drag overlay root to original parent
    let nodeRef = buttons[skill.id];
    let parentRef = buttons[isDragOverlayRoot ? dragOverlay.parentId : skill.parent ];
    // Get offsets of given element (for updateChildEdge).
    // Reference: How to Draw a Line Between Two divs with JavaScript? | https://thewebdev.info/2021/09/12/how-to-draw-a-line-between-two-divs-with-javascript/
    const getOffset = (el: React.RefObject<HTMLButtonElement>) => {
      const rect = el?.current?.getBoundingClientRect();
      if (!rect) return;
      return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width,
        height: rect.height,
      };
    };
    const off_p = getOffset(parentRef);
    const off_n = getOffset(nodeRef);
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