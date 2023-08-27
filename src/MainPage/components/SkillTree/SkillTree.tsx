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
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [activeSkill]);

  const getSkillByID = (id: string) => {
    let target = {};
    skills.forEach((skill) => {
      if (skill.id === id) target = skill;
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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setDragOverlay(active.id.toString());
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active || !over || active.id === over.id) return;
    const draggingSkill = dragOverlay.skills[0];
    // Whether id1 skill node is under id2 skill node
    const isNodeUnder = (ref1: React.RefObject<HTMLButtonElement>, ref2: React.RefObject<HTMLButtonElement>) => {
      if (!ref1 || !ref2) return;
      const getOffset = (el: React.RefObject<HTMLButtonElement>) => {
        const rect = el?.current?.getBoundingClientRect();
        if (!rect) return;
        return {
          top: rect.top + window.pageYOffset,
          right: rect.right + window.pageXOffset,
          bottom: rect.bottom + window.pageYOffset,
          left: rect.left + window.pageXOffset,
          width: rect.width,
          height: rect.height,
        };
      };
      let top1 = getOffset(ref1)?.top;
      let bottom2 = getOffset(ref2)?.bottom;
      if (top1 && bottom2) return top1 - bottom2 > 0;
      return false;
    }
    let draggingRef = dragOverlay.buttons[draggingSkill.id];
    let overRef = buttons[over.id.toString()];
    if(isNodeUnder(draggingRef, overRef)) {
      // Drop under peer
      dispatch({
        type: "SET_SKILL",
        id: active.id,
        skill: {
          ...getSkillByID(active.id.toString()),
          parent: over?.id.toString(),
        }
      })
    } else {
      // Normal drop
      dispatch({
        type: "DROP_SKILL",
        active: active,
        over: over,
      });
    }
    setTimeout(()=>setDragOverlay(""), 100);
  };

  const setDragOverlay = (id: string) => {
    if (!id) {
      dispatch({
        type: "SET_DRAG_OVERLAY",
        dragOverlay: {
          skills: [],
          buttons: {},
          parentId: 'root',
        },
      });
      return;
    }

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
    const getSkillParentId = (id: string) => {
      let p = 'root';
      for(const s of skills) {
        if (s.id === id) {
          p = s.parent;
          break;
        }
      }
      return p;
    }
    const newDragOverlaySkills = copySkills(id);
    dispatch({
      type: "SET_DRAG_OVERLAY",
      dragOverlay: {
        skills: newDragOverlaySkills,
        buttons: createButtons(newDragOverlaySkills),
        parentId: getSkillParentId(id),
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
    const getNearestParent = (px: number, py: number) => {
      let np = 'root';
      // get smallest distance in y
      let dy = Infinity;
      skills.forEach((skill) => {
        const rect = buttons[skill.id].current?.getBoundingClientRect();
        if(!rect) return;
        let ry = rect.bottom;
        let c_dy = py - ry;
        if(c_dy >= 0 && c_dy < dy) {  // Only gets node above
          dy = c_dy;
        }
      })
      // get nearest node in x in nearest y distance parents
      let dx = Infinity;
      skills.forEach((skill) => {
        const rect = buttons[skill.id].current?.getBoundingClientRect();
        if(!rect) return;
        let ry = rect.bottom;
        let c_dy = py - ry;
        if(c_dy !== dy) return;
        let rx = rect.left + window.pageXOffset + rect.width / 2;
        let c_dx = px - rx;
        if(Math.abs(c_dx) < dx) {   // Nearest in either direction
          dx = Math.abs(c_dx);
          np = skill.id;
        }
      })
      return np;
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
      {(!groups.length || !skills.length) ? (
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
