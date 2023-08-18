import React, { useState, useEffect, createRef } from "react";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimation,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import "./SkillTree.css";
import { v4 as uuid } from "uuid";
import { useStateValue } from "StateProvider";
import {
  Instruction,
  SkillLinks,
  SkillNodeLayer,
  SkillNodeContainer,
} from "./components";
import { Skill, Buttons } from "types";

export interface Props {
  skills: Array<Skill>; // skills to display
}

// Tree of skill nodes and their links.
export const SkillTree = ({ skills }: Props) => {
  const [{ activeSkill, buttons, groups, activeGroup }, dispatch] =
    useStateValue();
  const group = activeGroup;

  // Find the nearest (positioned) parent id of a skill.
  const getNearestParent = (px: number, py: number, id: string = "") => {
    // Get the distance from a parent node to a given point
    const getParentDist = (
      parent: React.RefObject<HTMLButtonElement>,
      px: number,
      py: number
    ) => {
      if (!parent.current) {
        return Infinity;
      }
      const rect = parent.current.getBoundingClientRect();
      let cx = rect.left + window.pageXOffset + rect.width / 2;
      let cy = rect.top + window.pageYOffset + rect.height / 2;
      let dx = px - cx;
      let dy = py - cy;
      return dy >= 0 ? Math.sqrt(dx * dx + dy * dy) : Infinity;
    };
    // Calculate the distance of each parent skills and find the nearest one
    let [target, minDist] = ["", Infinity];
    skills.forEach((skill) => {
      let dist = getParentDist(buttons[skill.id], px, py);
      if (dist < minDist && skill.id !== id) {
        target = skill.id;
        minDist = dist;
      }
    });

    return target;
  };

  /*
   * Dnd-kit Sortable
   */

  const sensors = useSensors(
    // Delay for onClick event of node button
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimation = {
    ...defaultDropAnimation,
  };

  const getSkillByID = (id: string) => {
    let target = {};
    skills.forEach((skill) => {
      if (skill.id === id) target = skill;
    });
    return target;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setDragOverlay(active.id.toString());
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    dispatch({
      type: "DROP_SKILL",
      active: active,
      over: over,
    });
    setDragOverlay("");
  };

  const [dragOverlaySkills, setDragOverlaySkills]: [Array<Skill>, Function] =
    useState([]);
  const [dragOverlayButtons, setDragOverlayButtons]: [Buttons, Function] =
    useState({});
  const [draggingSkillIDs, setDraggingSkillIDs]: [Array<string>, Function] =
    useState([]);

  // Copy over skills (with different IDs) starting from the target id for DragOverlay.
  const copySkills = (id: string) => {
    // Copy over sub array of skills from the given skill id
    let newSkills = [JSON.parse(JSON.stringify(getSkillByID(id)))];
    for (let i = 0; i < newSkills.length; i++) {
      for (const s of skills) {
        if (s.parent === newSkills[i].id) {
          newSkills = [...newSkills, JSON.parse(JSON.stringify(s))];
        }
      }
    }
    // Change the IDs of the copied skills
    const changeIDs = (targets: Array<Skill>) => {
      for (const p of targets) {
        let n = uuid();
        for (const c of targets) {
          if (p.id === c.parent)
            // replace children's parent id
            c.parent = n;
        }
        p.id = n; // replace parent's id
      }
    };
    newSkills[0].parent = "root";
    changeIDs(newSkills);
    return newSkills;
  };

  // Create buttons for target skills
  const createButtons = (targets: Array<Skill>) => {
    let cb: Buttons = {};
    for (const t of targets) {
      cb[t.id] = createRef();
    }
    return cb;
  };

  const setDragOverlay = (id: string) => {
    if (!id) {
      setDragOverlaySkills([]);
      setDragOverlayButtons({});
      setDraggingSkillIDs([]);
    }
    const newDragOverlaySkills = copySkills(id);
    setDragOverlaySkills(newDragOverlaySkills);
    setDragOverlayButtons(createButtons(newDragOverlaySkills));
    let newDraggingSkillIDs = [id];
    for (let i = 0; i < newDraggingSkillIDs.length; i++) {
      for (const s of skills) {
        if (s.parent === newDraggingSkillIDs[i]) {
          newDraggingSkillIDs = [...newDraggingSkillIDs, s.id];
        }
      }
    }
    setDraggingSkillIDs(newDraggingSkillIDs);
  };

  // Add skill to a parent
  const addSkill = (parentID: string) => {
    if (!group) {
      return;
    }
    dispatch({
      type: "ADD_SKILL",
      parentID: parentID,
      group: group,
    });
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    // Add new skill
    if (!group) {
      return;
    }
    if (!skills.length) {
      addSkill("root");
      return;
    }
    let target = getNearestParent(event.clientX, event.clientY);
    addSkill(target ? target : "root");
  };

  useEffect(() => {
    // Scroll active skill button to the center for better view
    // Reference: Coding Ceauty: How to Scroll to an Element in React | https://codingbeautydev.com/blog/react-scroll-to-element/#:~:text=Key%20takeaways,scroll%20to%20the%20desired%20element.
    if (activeSkill) {
      buttons[activeSkill.id].current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [activeSkill]);

  return (
    <div className="skill_tree">
      {" "}
      {!groups.length || !skills.length ? (
        <Instruction
          group={group}
          skills={skills}
          handleDoubleClick={handleDoubleClick}
        />
      ) : (
        <div
          className={"container" + (activeSkill ? " expand" : "")}
          onDoubleClick={handleDoubleClick}
        >
          {skills.length ? (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SkillNodeLayer id="root" skills={skills} buttons={buttons} />
                <DragOverlay dropAnimation={dropAnimation}>
                  {dragOverlaySkills.length ? (
                    <SkillNodeContainer
                      key={
                        dragOverlaySkills[0] ? dragOverlaySkills[0].id : null
                      }
                      skill={dragOverlaySkills[0]}
                      skills={dragOverlaySkills}
                      buttons={dragOverlayButtons}
                      isDragOverlay={true}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
              <SkillLinks
                skills={[...skills, ...dragOverlaySkills]}
                buttons={{ ...buttons, ...dragOverlayButtons }}
                excludes={draggingSkillIDs}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SkillTree;
