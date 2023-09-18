import React, { createRef, useEffect, useState } from "react";
import "./SkillTree.css";
import { useStateValue } from "StateProvider";
import { Message, SkillNodeLayer } from "./components";
import { Buttons, Skill } from "types";

export interface Props {
  skills: Array<Skill>; // skills to display
}

/**
 * Tree of skill nodes and their links
 * - Instruction        | instructional text to prompt user to create a group or create a skill
 * - SkillNodeLayer     | contains the root row of skill nodes
 * - SkillNodeContainer | contains one skill node and its children (for dragOverlay)
 */
export const SkillTree = ({ skills }: Props) => {
  const [{ activeSkill, groups, activeGroup }] =
    useStateValue();
  const group = activeGroup;

  const [buttons, setButtons]: [Buttons, Function] = useState({});

  useEffect(() => {
    for (const skill of skills) {
      buttons[skill.id] = createRef();
    }
    setButtons(buttons)
  }, [skills])
  

  useEffect(() => {
    // Scroll activated skill button to the center for better view
    // Reference: Coding Beauty: How to Scroll to an Element in React | https://codingbeautydev.com/blog/react-scroll-to-element/#:~:text=Key%20takeaways,scroll%20to%20the%20desired%20element.
    if (activeSkill) {
      buttons[activeSkill.id].current?.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [activeSkill]);

  return (
    <div className="skill_tree">
      {!skills.length ? (
        <Message skills={skills} />
      ) : (
        <div className="container">
          {skills.length ? (
              <SkillNodeLayer id="root" skills={skills} buttons={buttons} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SkillTree;
