import React from "react";
import SkillNodeButton from "./SkillNodeButton";
import "./SkillNodeContainer.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SkillNodeLayer from "./SkillNodeLayer";
import { useStateValue } from "../../StateProvider";

/**
 * A subtree of skill nodes consists of one root node and a node layer as children.
 * @param {Object} skill the root node of the subtree
 * @param {Array} skills array of all the skill objects
 * @param {Object} buttons keys of skill ids corresponding to their button reference
 * @param {Function} operateSkills operation on skills (see App.js)
 * @param {Function} openEdit open skill editing panel
 * @param {boolean} isDragOverlay whether the layer is used by DragOverlay
 * @returns
 */
function SkillNodeContainer({ skill, skills, isDragOverlay }) {
  const [{ buttons }, dispatch] = useStateValue();

  /* For dnd-kit sortable
   * References:
   *  dnd-kit sortable documentation | https://docs.dndkit.com/presets/sortable
   *  dnd-kit sortable example: drag and drop to-do | https://codesandbox.io/s/react-drag-drop-todo-rwn8d3?file=/src/components/BoardSectionList.tsx:2714-2726
   */

  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: skill.id,
      transition: { duration: 300, easing: "ease" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="skill_node_container">
        <SkillNodeButton
          skill={skill}
          buttonRef={buttons[skill.id]}
          listeners={listeners}
          isDragOverlay={isDragOverlay}
        />
        <SkillNodeLayer
          id={skill.id}
          skills={skills}
          isDragOverlay={isDragOverlay}
        />
      </div>
    </div>
  );
}

export default SkillNodeContainer;
