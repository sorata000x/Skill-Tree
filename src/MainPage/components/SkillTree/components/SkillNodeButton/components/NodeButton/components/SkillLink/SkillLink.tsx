import { Skill, Buttons } from "types";
import "./SkillLink.css";
import React, { useState, useEffect } from "react";
import { getOffset } from "utilities";

export interface Props {
  skill: Skill,
  buttons: Buttons,
  isDragOverlay: boolean | undefined,
}

/**
 * Line to connect from a node button to its parent node button
 * Note: 
 * - The reason for binding link with node button instead of passing button reference
 *   and render all links in the background is so the link can move with button and
 *   cause less manual rendering.
 */
export const SkillLink = ({skill, buttons, isDragOverlay}: Props) => {
  //const [{ dragOverlay}, ] = useStateValue();
  const [updating, setUpdating] = useState(true);  // only update when interacting with page
  const [time, setTime] = useState(new Date());  // to keep updating link

  useEffect(() => {
    // Note: Time needed to render might differ
    setTimeout(()=>setUpdating(false), 100);  // Give link some time to finish render
    document.addEventListener("mousedown", ()=>setUpdating(true));
    document.addEventListener("mouseup", ()=>setTimeout(()=>setUpdating(false), 100));
  }, [])

  useEffect(() => {
    if (!updating) return;
    // Update every 0 ms
    const interval = setInterval(() => setTime(new Date()), 0);
    return () => {
      clearInterval(interval);
    };
  });

  // Update the positon of the links between the node and its parent
  const getLink = () => {
    /* Connecting drag overlay root with original parent (doesn't work well)
     const isDragOverlayRoot = isDragOverlay && skill.parent === 'root';  // connect drag overlay root to original parent
     let parentRef = buttons[isDragOverlayRoot ? dragOverlay.parentId : skill.parent]; */
    let nodeRef = buttons[skill.id];
    let parentRef = buttons[skill.parent];
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
        className="skill_link"
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