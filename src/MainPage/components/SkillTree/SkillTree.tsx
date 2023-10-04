import React, { useEffect, createRef, useState } from "react";
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
import { Instruction, SkillNodeLayer, SkillNodeContainer, SkillDragOverlay } from "./components";
import { Skill, Buttons } from "types";

export interface Props {
  skills: Array<Skill>,
  buttons: Buttons,
  viewOnly?: boolean,
}

/**
 * Tree of skill nodes and their links
 * - Instruction        | instructional text to prompt user to create a group or create a skill
 * - SkillNodeLayer     | contains the root row of skill nodes
 * - SkillNodeContainer | contains one skill node and its children (for dragOverlay)
 */
export const SkillTree = ({skills, buttons, viewOnly}: Props) => {
  const [{ activeSkill, groups, activeGroup, dragOverlay }, dispatch] =
    useStateValue();
  const group = activeGroup;
  const [rootSkill, setRootSkill]: [Skill | null, Function] = useState(null);
  
  useEffect(() => {
    

    console.log(`skills: ${JSON.stringify(skills)}`)
    
    // Find root skill and set it
    for(const s of skills) {
      if(s.parent === "root") {
        setRootSkill(s);
        console.log(`set root skill to: ${JSON.stringify(s)}`)
        return;
      }
    }

    if (!activeGroup) return;

    // If no root skill, create one with group name
    dispatch({
      type: "ADD_SKILL",
      name: activeGroup?.name,
      parentID: "root",
      group: activeGroup,
    })
  }, [skills])

  useEffect(() => {
    // Scroll activated skill button to the center for better view
    // Reference: Coding Beauty: How to Scroll to an Element in React | https://codingbeautydev.com/blog/react-scroll-to-element/#:~:text=Key%20takeaways,scroll%20to%20the%20desired%20element.
    if (activeSkill) {
      buttons[activeSkill.id].current?.scrollIntoView({
        block: "start",
        inline: "start",
        behavior: "smooth",
      });
    }
  }, [activeSkill]);

  /* Utils */

  // Get skill by ID
  // Usage: copySkills
  const getSkillByID = (id: string) => {
    let target = {};
    skills.forEach((skill) => {
      if (skill.id === id) target = skill;
    });
    return target;
  };

  // Whether id1 skill node is under id2 skill node
  // Usage: handleDragEnd
  const isNodeUnder = (
    ref1: React.RefObject<HTMLButtonElement>,
    ref2: React.RefObject<HTMLButtonElement>
  ) => {
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
  };

  // Copy over skills (with different IDs) starting from the target id
  // Usage: setDragOverlay
  const copySkills = (id: string) => {
    // Copy over sub array of skills from the given skill id
    let newSkills = [JSON.parse(JSON.stringify(getSkillByID(id)))];
    for (let i = 0; i < newSkills.length; i++) {
      // copy down from parents to their children
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
  // Usage: setDragOverlay
  const createButtons = (targets: Array<Skill>) => {
    let cb: Buttons = {};
    for (const t of targets) {
      cb[t.id] = createRef();
    }
    return cb;
  };

  const getSkillParentId = (id: string) => {
    let p = "root";
    for (const s of skills) {
      if (s.id === id) {
        p = s.parent;
        break;
      }
    }
    return p;
  };

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
    let np = "root";
    // get smallest distance in y
    let dy = Infinity;
    skills.forEach((skill) => {
      const rect = buttons[skill.id].current?.getBoundingClientRect();
      if (!rect) return;
      let ry = rect.bottom;
      let c_dy = py - ry;
      if (c_dy >= 0 && c_dy < dy) {
        // Only gets node above
        dy = c_dy;
      }
    });
    // get nearest node in x in nearest y distance parents
    let dx = Infinity;
    skills.forEach((skill) => {
      const rect = buttons[skill.id].current?.getBoundingClientRect();
      if (!rect) return;
      let ry = rect.bottom;
      let c_dy = py - ry;
      if (c_dy !== dy) return;
      let rx = rect.left + window.pageXOffset + rect.width / 2;
      let c_dx = px - rx;
      if (Math.abs(c_dx) < dx) {
        // Nearest in either direction
        dx = Math.abs(c_dx);
        np = skill.id;
      }
    });
    return np;
  };

  /* Dnd-kit Sortable */

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setDragOverlay(active.id.toString());
  };

  const setDragOverlay = (id: string) => {
    // Remove drag overlay if not dragging any node
    if (!id) {
      dispatch({
        type: "REMOVE_DRAG_OVERLAY",
      });
      return;
    }
    // Copy subtree from the dragging ID and set it as drag overlay
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

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    // Handle where to drop dragging node
    if (!active || !over || active.id === over.id || !dragOverlay) return;
    const draggingSkill = dragOverlay.skills[0];
    let draggingRef = dragOverlay.buttons[draggingSkill.id];
    let overRef = buttons[over.id.toString()];
    if (isNodeUnder(draggingRef, overRef)) {
      // drop to over node if active node is under it
      // Drop under peer
      dispatch({
        type: "SET_SKILL",
        id: active.id,
        skill: {
          ...getSkillByID(active.id.toString()),
          parent: over?.id.toString(),
        },
      });
    } else {
      // Normal drop
      dispatch({
        type: "DROP_SKILL",
        active: active,
        over: over,
      });
    }
    // delay for smooth dropping behavior
    setTimeout(() => setDragOverlay(""), 100);
  };

  /* HTML Event */

  const handleDoubleClick = (event: React.MouseEvent) => {
    // Add new skill if double click on background
    if (!group) return;
    let target = getNearestParent(event.clientX, event.clientY);
    if(target) addSkill(target);
  };

  return (
    <div className="skill_tree" onDoubleClick={handleDoubleClick}>
      {!groups.length ? (
        <Instruction
          group={group}
        />
      ) : (
        <div
          className={"container" + (activeSkill ? " expand" : "")}  // if a skill is active, expand the container so it can be scroll into center
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="scale_container" 
              style={{transform: `scale(${activeGroup?.zoom})`}}   // adjust tree size according to group zoom only for root so to not repeat scaling
              >
              {
                rootSkill ? 
                <SkillNodeContainer
                  skill={rootSkill}
                  skills={skills}
                  buttons={buttons}
                /> : null
              }
            </div>
              <SkillDragOverlay />
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default SkillTree;
