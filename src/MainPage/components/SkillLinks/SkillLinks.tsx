import React, { useState, useEffect, createRef } from "react";
import "./SkillLinks.css";
import { Buttons, Links, Skill } from "types";
import { useParams } from "react-router-dom";
import { useStateValue } from "StateProvider";

export interface Props {
  skills: Array<Skill>,
  buttons: Buttons,
  excludes: Array<string>,
}

// Links between skill nodes.
export const SkillLinks = ({skills, buttons, excludes}: Props) => {
  const groupId = useParams().pathParam; // get current group from url parameter
  const [links, setLinks]: [Links, Function] = useState({});

  useEffect(() => {
    setLinks({});
    for (const skill of skills) {
      links[skill.id] = <div />;
    }
  }, [skills]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update links
    for (const skill of skills) {
      updateLink(skill);
    }
    // Update every 1 ms
    const interval = setInterval(() => setTime(new Date()), 0);
    return () => {
      clearInterval(interval);
    };
  });

  // Update the positon of the links between the nodes
  const updateLink = (skill: Skill) => {
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
    const top = off_p.top + off_p.height / 2 + 140;
    const left = off_n.left + off_n.width / 2;

    let newLink = (
      <div
        className="link dark" 
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

  return (
    <div className="links">
      {Object.values(links)}
    </div>
  )
};
