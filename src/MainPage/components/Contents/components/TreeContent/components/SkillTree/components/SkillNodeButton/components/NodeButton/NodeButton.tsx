import "./NodeButton.css";
import React, { useEffect, useState } from "react";
import { useTree, useMain } from "StateProvider";
import { Buttons, Skill } from "types";
import { NodeTitle, SkillPreview, SkillLink, NodeIcon } from "./components";

export interface Props {
  buttons: Buttons;
  skill: Skill;
  buttonRef: React.RefObject<HTMLButtonElement>;
  listeners: any;
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
  buttons,
  skill,
  buttonRef,
  listeners,
  isDragOverlay,
}: Props) => {
  const [{ activeSkill }, dispatchMain] = useMain();
  const [, dispatchTree] = useTree();
  const [{ dragOverlay }, ] = useTree();
  const [isActive, setActive] = useState(false);
  const [isMouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    setActive(activeSkill?.id === skill.id); // Update active
  }, [activeSkill, skill]);

  const handleClick = (e: React.MouseEvent) => {
    if (isDragOverlay) return;
    e.stopPropagation();
    dispatchMain({
      type: "SET_ACTIVE_SKILL",
      activeSkill: skill,
    });
  };

  useEffect(() => {
    dispatchTree({
      type: "UPDATE_LINKS"
    })
  }, [buttonRef])

  return (
    <div
      className="node_button"
      onMouseDown={(e)=>e.stopPropagation()}
    >
      <SkillLink
        skill={skill}
        buttons={
          isDragOverlay ? { ...buttons, ...dragOverlay?.buttons } : buttons
        }
        isDragOverlay={isDragOverlay}
      />
      <button
        ref={buttonRef}
      />
      <SkillPreview 
        open={isMouseOver} 
        skill={skill} />
      <NodeTitle
        skill={skill}
        isDragOverlay={isDragOverlay}
      />
      <NodeIcon
        open={!!skill.icon}
        src={skill.icon?.url}
        scale={skill.icon?.scale}
      />
      <div 
        className={isActive ? "button_listener active" : "button_listener"}
        onClick={(e) => handleClick(e)}
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
        {...listeners}
      />
    </div>
  );
};
