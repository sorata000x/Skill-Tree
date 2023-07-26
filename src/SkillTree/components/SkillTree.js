import React, { useState, createRef } from 'react'
import SkillNodeLayer from './SkillNodeLayer'
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimation,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import './SkillTree.css';
import { v4 as uuid } from 'uuid';
import SkillNodeContainer from './SkillNodeContainer';
import SkillLinks from './SkillLinks';
import { useStateValue } from '../../StateProvider';

/**
 * Tree of skill nodes and their links.
 * @param {Array} skills array of all the skill objects
 * @param {Object} buttons keys of skill ids corresponding to their button reference 
 * @param {Function} operateSkills operation on skills (see App.js) 
 * @param {Function} openEdit open skill editing panel
 * @returns 
 */
function SkillTree({skills, buttons, group, openEdit}) {
  
  const [dragginSkillIDs, setDraggingSkillIDs] = useState([]);
  const [{}, dispatch] = useStateValue();

  /**
   * Find the nearest (positioned) parent id of a skill.
   * @param {String} id skill id
   * @returns nearest parent id
   */
  const getNearestParent = (px, py, id=null) => {

    /**
     * Get the distance from a parent node to a given point
     * @param {Object} parent a parent node 
     * @param {Number} px x coordinate of a point
     * @param {Number} py y coordinate of a point
     * @returns 
     */
    const getParentDist = (parent, px, py) => {
      if (!parent.current) {
        return Infinity;
      }
      const rect = parent.current.getBoundingClientRect();
      let cx = rect.left + window.pageXOffset + rect.width / 2
      let cy = rect.top + window.pageYOffset + rect.height / 2
      let dx = px - cx;
      let dy = py - cy;
      return dy >= 0 ? Math.sqrt(dx * dx, dy * dy) : Infinity;
    }

    // Calculate the distance of each parent skills and find the nearest one
    let [target, minDist] = [null, Infinity];
    skills.forEach(skill => {
      let dist = getParentDist(buttons[skill.id], px, py);
      if (dist < minDist && skill.id !== id) {
        target = skill.id;
        minDist = dist;
      }
    });

    return target
  }

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
  )

  const dropAnimation = {
    ...defaultDropAnimation,
  }

  const getSkillByID = (id) => {
    let target = {};
    skills.forEach(skill => {
      if (skill.id === id)
        target = skill;
    })
    return target;
  }

  const handleDragStart = ({active, over}) => {
    setDragOverlay(active.id);
  }

  const handleDragOver = ({active, over}) => {
  }

  const handleDragEnd = ({active, over}) => {
    dispatch({
      type: "DROP_SKILL",
      active: active,
      over: over,
    })
    setDragOverlay(null);
  }

  const [dragOverlaySkills, setDragOverlaySkills] = useState([]);
  const [dragOverlayButtons, setDragOverlayButtons] = useState({});
 
  /**
   * Copy over skills (with different IDs) starting from the target id for DragOverlay.
   * @param {String} id starting target skill id 
   * @returns an array of copied skills
   */
  const copySkills = (id) => {
    // Copy over sub array of skills from the given skill id
    let newSkills = [JSON.parse(JSON.stringify(getSkillByID(id)))];
    for (const d of newSkills) {
      for (const s of skills) {
        if (s.parent === d.id) {
          newSkills = [...newSkills, JSON.parse(JSON.stringify(s))];
        }
      }
    }
    // Change the IDs of the copied skills
    const changeIDs = (targets) => {
      for (const p of targets) {
        let n = uuid();
        for (const c of targets) {
          if (p.id === c.parent)  // replace children's parent id
            c.parent = n;
        }
        p.id = n;                 // replace parent's id
        p.isDragOverlay = true;
      }
    }
    newSkills[0].parent = 'root';
    changeIDs(newSkills);
    return newSkills;
  }

  /**
   * Create buttons for target skills
   * @param {Array} targets an array of skills
   */
  const createButtons = (targets) => {
    let cb = {};
    for (const t of targets) {
      cb[t.id] = createRef();
    }
    return cb;
  }

  const setDragOverlay = (id) => {
    if (!id) {
      setDragOverlaySkills([]);
      setDragOverlayButtons({});
      setDraggingSkillIDs([]);
    }
    const newDragOverlaySkills = copySkills(id)
    setDragOverlaySkills(newDragOverlaySkills);
    setDragOverlayButtons(createButtons(newDragOverlaySkills));
    let newDraggingSkillIDs = [id]
    for (const d of newDraggingSkillIDs) {
      for (const s of skills) {
        if (s.parent === d) {
          newDraggingSkillIDs = [...newDraggingSkillIDs, s.id];
        }
      }
    }
    setDraggingSkillIDs(newDraggingSkillIDs)
  }

  /**
   * Add skill to a parent
   * @param {String} parentID 
   */
  const addSkill = (parentID) => {
    dispatch({
      type: "ADD_SKILL",
      parentID: parentID,
      group: group,
    })
  }

  const handleDoubleClick = (event) => {
    if (!skills.length) {
      addSkill('root')
      return;
    }
    let target = getNearestParent(event.clientX, event.clientY);
    addSkill(target ? target : 'root');
  }

  return (
    <div 
      className='skill_tree_container' 
      onDoubleClick={handleDoubleClick}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        <SkillNodeLayer 
          id='root' 
          skills={skills} 
          buttons={buttons}
          openEdit={openEdit} />
        <DragOverlay 
          dropAnimation={dropAnimation}>
          {dragOverlaySkills.length ? 
            <SkillNodeContainer 
              key={dragOverlaySkills[0] ? dragOverlaySkills[0].id : null} 
              skill={dragOverlaySkills[0]}
              skills={dragOverlaySkills}
              buttons={dragOverlayButtons}
              isDragOverlay={true}/>
            : null}
        </DragOverlay>
      </DndContext>
      <SkillLinks 
        skills={[...skills, ...dragOverlaySkills]} 
        buttons={{...buttons, ...dragOverlayButtons}}
        excludes={dragginSkillIDs}/>
    </div>
  )
}

export default SkillTree
