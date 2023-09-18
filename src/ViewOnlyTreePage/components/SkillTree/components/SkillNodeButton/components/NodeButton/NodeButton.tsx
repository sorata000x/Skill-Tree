import "./NodeButton.css";
import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "StateProvider";
import { Buttons, Skill } from "types";
import { NodeTitle, SkillPreview, SkillLink, NodeIcon } from "./components";

export interface Props {
  skill: Skill;
  buttons: Buttons,
  buttonRef: React.RefObject<HTMLButtonElement>;
  isDragOverlay?: boolean;
}

/**
 * Button as node, click to open skill edit side window
 * - SkillLink    | a link of to this skill node's parent node button
 * - SkillPreview | small popup to show skill info, show by hovering on node button
 * - NodeTitle    | skill's title
 * - NodeIcon     | skill's icon
 */
export const NodeButton = ({
  skill,
  buttons,
  buttonRef,
  isDragOverlay,
}: Props) => {
  const [{ activeSkill }, dispatch] = useStateValue();
  const [isActive, setActive] = useState(false);
  const [isMouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    setActive(activeSkill?.id === skill.id); // Update active
  }, [activeSkill, skill]);

  const handleClick = (e: React.MouseEvent) => {
    if (isDragOverlay) return;
    e.stopPropagation();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: skill,
    });
  };

  return (
    <div
      className="node_button"
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
    >
      <SkillLink
        skill={skill}
        buttons={
          buttons
        }
        isDragOverlay={isDragOverlay}
      />
      <button
        className={isActive && !skill.maxLevel ? " active" : ""}
        ref={buttonRef}
        onClick={handleClick}
      />
      <SkillPreview open={isMouseOver} skill={skill} />
      <NodeTitle
        skill={skill}
        isDragOverlay={isDragOverlay}
        handleClick={(e) => handleClick(e)}
      />
      <NodeIcon
        open={!!skill.icon}
        src={skill.icon?.url}
        scale={skill.icon?.scale}
        onClick={(e) => handleClick(e)}
      />
    </div>
  );
};
