import React, { useState, useEffect, createRef } from "react";
import "./SkillLinks.css";
import { Buttons, Links, Skill } from "types";

export interface Props {
  skills: Array<Skill>,      // array of skills to display
  buttons: Buttons,          // keys of skill ids corresponding to their button reference
  excludes: Array<string>,   // skill ids to not render link (when they are being dragged)
}

// Links between skill nodes.
export const SkillLinks = ({ skills, buttons, excludes }: Props) => {
  const [links, setLinks]: [Links, Function] = useState({});

  useEffect(() => {
    setLinks({});
    for (const skill of skills) {
      links[skill.id] = <div />;
    }
  }, [links, skills]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update links
    for (const skill of skills) {
      updateLink(skill);
    }
    // Update every 1 ms
    const interval = setInterval(() => setTime(new Date()), 1);
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  // Update the positon of the links between the nodes
  const updateLink = (skill: Skill) => {
    if (!buttons[skill.id] || !buttons[skill.parent] || !buttons[skill.id].current || !buttons[skill.parent].current) return;

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
    const top = off_p.top + off_p.height / 2 + 140;
    const left = off_n.left + off_n.width / 2;

    let newLink = (
      <div
        className="link"
        style={{
          width: length,
          left: left,
          top: top,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "top left",
          opacity: excludes.includes(skill.id) ? 0 : 1,
        }}
      />
    );

    links[skill.id] = newLink;
  };

  return Object.values(links);
}
