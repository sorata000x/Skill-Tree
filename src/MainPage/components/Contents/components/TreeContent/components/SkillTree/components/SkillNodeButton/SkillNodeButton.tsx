import React, { createRef, useEffect, useState } from "react";
import "./SkillNodeButton.css";
import "react-circular-progressbar/dist/styles.css";
import {
  NodeButton,
  SkillProgress,
  LevelChangeButtons,
  ToggleButton,
  MoreButton
} from "./components";
import { Buttons, Skill } from "types";
import { useUser } from "StateProvider";

export interface Props {
  buttons: Buttons,
  skill: Skill;
  buttonRef: React.RefObject<HTMLButtonElement>;
  listeners: any;
  isDragOverlay?: boolean;
}

/**
 * Skill button contains:
 * - NodeButton        | node button
 * - SkillProgress     | progress bar around button
 * - LevelChangeButton | buttons to change skill level
 * - ToggleButton      | button to toggle subtree
 */
export const SkillNodeButton = ({
  buttons,
  skill,
  buttonRef,
  listeners,
  isDragOverlay,
}: Props) => {
  const [isMouseOver, setMouseOver] = useState(false);
  const [, dispatch] = useUser();

  useEffect(() => {
    if(!(skill.id in buttons)) buttons[skill.id] = createRef();
  }, [skill])

  // Set the level of the skill for this button.
  const setLevel = (level: number) => {
    skill.level = level;
    dispatch({
      type: "SET_SKILL",
      id: skill.id,
      skill: skill,
    });
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    setMouseOver(true);
  };

  return (
    <div
      className="skill_node_button"
      onMouseOver={(e) => handleMouseOver(e)}
      onMouseOut={(e) => setMouseOver(false)}
    >
        <SkillProgress
          id={skill.id}
          level={skill.level}
          maxLevel={skill.maxLevel}
        />
        <NodeButton
          buttons={buttons}
          skill={skill}
          buttonRef={buttonRef}
          listeners={listeners}
          isDragOverlay={isDragOverlay}
        />
        <MoreButton 
          open={isMouseOver}
          skill={skill}
        />
        <ToggleButton skill={skill} />
    </div>
  );
};
