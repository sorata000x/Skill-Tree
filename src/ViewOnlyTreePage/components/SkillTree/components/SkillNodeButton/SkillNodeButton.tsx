import React, { useEffect, useState } from "react";
import "./SkillNodeButton.css";
import "react-circular-progressbar/dist/styles.css";
import {
  NodeButton,
  SkillProgress,
  ToggleButton,
} from "./components";
import { Buttons, Skill } from "types";
import { useStateValue } from "StateProvider";

export interface Props {
  skill: Skill,
  buttons: Buttons,
  buttonRef: React.RefObject<HTMLButtonElement>,
  isDragOverlay?: boolean,
}

/**
 * Skill button contains:
 * - NodeButton        | node button
 * - SkillProgress     | progress bar around button
 * - LevelChangeButton | buttons to change skill level
 * - ToggleButton      | button to toggle subtree
 */
export const SkillNodeButton = ({
  skill,
  buttons,
  buttonRef,
  isDragOverlay,
}: Props) => {
  const [isMouseOver, setMouseOver] = useState(false);
  const [, dispatch] = useStateValue();

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
      <NodeButton
        skill={skill}
        buttonRef={buttonRef}
        isDragOverlay={isDragOverlay}
        buttons={buttons}
      />
      <SkillProgress
        id={skill.id}
        level={skill.level}
        maxLevel={skill.maxLevel}
      />
      <ToggleButton skill={skill} />
    </div>
  );
};
