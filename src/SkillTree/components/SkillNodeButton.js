import React, { createRef, useEffect, useState } from "react";
import "./SkillNodeButton.css";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { useStateValue } from "../../StateProvider";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/**
 * A button of skill node.
 * @param {Object} skill of this button
 * @param {Ref} buttonRef button reference associated with the skill
 * @param {Function} operateSkills operation on skills (see App.js)
 * @param {Function} openEdit open skill editing panel
 * @param {Object} listeners listeners for dnd-kit sortable dragging function
 * @returns
 */
function SkillNodeButton({ skill, buttonRef, listeners, isDragOverlay }) {
  const [isMouseOver, setMouseOver] = useState(false);
  const [{ activeSkill }, dispatch] = useStateValue();

  /**
   * Set the level of the skill for this button.
   * @param {Number} level
   */
  const setLevel = (level) => {
    skill.level = level;
    dispatch({
      type: "SET_SKILL",
      id: skill.id,
      skill: skill,
    });
  };

  const LevelChangeButtons = () => {
    const increaseLevel = (e) => {
      e.stopPropagation();
      if (skill.level < skill.maxLevel) {
        setLevel(skill.level + 1);
      }
    };
    const decreaseLevel = (e) => {
      e.stopPropagation();
      if (skill.level > 0) {
        setLevel(skill.level - 1);
      }
    };
    return (
      <div className="level_change_container">
        <button
          className="level_change_button"
          onClick={increaseLevel}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          <HiOutlinePlus className="level_change_icon" size={24} />
        </button>
        <div className="level_change_divider" />
        <button
          className="level_change_button"
          onClick={decreaseLevel}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          <HiOutlineMinus className="level_change_icon" size={24} />
        </button>
      </div>
    );
  };

  const handleClick = (e) => {
    if (isDragOverlay) {
      return;
    }
    e.stopPropagation();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: skill,
    });
  };

  useEffect(() => {
    console.log(`image: ${JSON.stringify(skill.image)}`);
  }, [skill.image]);

  return (
    <div
      className="skill_node_button_container"
      onMouseOver={(e) => {
        setMouseOver(true);
      }}
      onMouseLeave={(e) => {
        setMouseOver(false);
      }}
    >
      <button
        className={
          "skill_node_button" + (activeSkill?.id === skill.id ? " active" : "")
        }
        ref={buttonRef}
        onClick={handleClick}
        {...listeners}
      >
        <div className="skill_node_title">{skill.title}</div>
        {skill.image ? (
          <img className="skill_image" alt="skill_image" src={skill.image} />
        ) : null}
      </button>
      <div
        className={
          "skill_progress_container" +
          (activeSkill?.id === skill.id ? " active" : "")
        }
      >
        {/* Example: Base react-circular-progressbar examples | https://codesandbox.io/s/vymm4oln6y?file=/index.js:6428-6517 */}
        <CircularProgressbar
          value={(skill.level / skill.maxLevel) * 100}
          strokeWidth={50}
          styles={buildStyles({
            strokeLinecap: "butt",
          })}
        />
      </div>
      {isMouseOver ? <LevelChangeButtons /> : null}
    </div>
  );
}

export default SkillNodeButton;
