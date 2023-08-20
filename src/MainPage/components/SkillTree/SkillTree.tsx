import React, { useEffect, createRef } from "react";
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
import { Instruction, SkillNodeLayer, SkillNodeContainer } from "./components";
import { Skill, Buttons } from "types";

export interface Props {
  skills: Array<Skill>; // skills to display
}

// Tree of skill nodes and their links.
export const SkillTree = ({ skills }: Props) => {
  const [{ activeSkill, buttons, groups, activeGroup, dragOverlay }, dispatch] =
    useStateValue();
  const group = activeGroup;

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

  const setDragOverlay = (id: string) => {
    if (!id) {
      dispatch({
        type: "SET_DRAG_OVERLAY",
        dragOverlay: {
          skills: [],
          buttons: {},
        },
      });
    }

    // Copy over skills (with different IDs) starting from the target id for DragOverlay.
    const copySkills = (id: string) => {
      const getSkillByID = (id: string) => {
        let target = {};
        skills.forEach((skill) => {
          if (skill.id === id) target = skill;
        });
        return target;
      };
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

    const newDragOverlaySkills = copySkills(id);
    dispatch({
      type: "SET_DRAG_OVERLAY",
      dragOverlay: {
        skills: newDragOverlaySkills,
        buttons: createButtons(newDragOverlaySkills),
      },
    });
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    // Add skill to a parent
    const addSkill = (parentID: string) => {
      if (!group) return;
      dispatch({
        type: "ADD_SKILL",
        parentID: parentID,
        group: group,
      });
    };
    // Find the nearest (positioned) parent id of a skill
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
    // Add new skill
    if (!group) return;
    if (!skills.length) {
      addSkill("root");
      return;
    }
    let target = getNearestParent(event.clientX, event.clientY);
    addSkill(target ? target : "root");
  };

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SkillNodeLayer id="root" skills={skills} buttons={buttons} />
              <DragOverlay dropAnimation={dropAnimation}>
                {dragOverlay.skills.length ? (
                  <SkillNodeContainer
                    key={
                      dragOverlay.skills[0] ? dragOverlay.skills[0].id : null
                    }
                    skill={dragOverlay.skills[0]}
                    skills={dragOverlay.skills}
                    buttons={dragOverlay.buttons}
                    isDragOverlay={true}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SkillTree;
