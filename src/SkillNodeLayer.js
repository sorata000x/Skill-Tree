import React, { useState, createRef, useEffect } from 'react'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SkillNodeContainer from './SkillNodeContainer'
import './SkillNodeLayer.css'
import { useDroppable } from '@dnd-kit/core'
import { useStateValue } from './StateProvider'
import { v4 as uuid } from 'uuid';

function SkillNodeLayer({ id, skills, operateSkills, buttons, isDragOverlay }) {
  const { setNodeRef } = useDroppable({id});

  /**
   * Add skill to a parent
   * @param {*} parentID 
   */
  const addSkill = (parentID) => {
    const skillID = uuid()
    operateSkills({
      type: "ADD_SKILL",
      skill: {
        id: skillID,
        title: `${skillID}`,
        level: 0,
        children: [],
        parent: parentID,
      }
    })
  }

  /**
   * Calculates the distance between a point and the bottom of a parent (a node above).
   * (to get nearest parent).
   * @param {*} el element reference 
   * @param {*} px point x coordinate
   * @param {*} py point y coordinate
   * @returns distance between node and point; Infinity if node bottom is below the point.
   */
  const getParentDist = (parent, px, py) => {
    if (!parent.current) {
      return Infinity;
    }
    const rect = parent.current.getBoundingClientRect();
    let cx = rect.left + window.pageXOffset + rect.width / 2
    let by = rect.top + window.pageYOffset + rect.height
    let dx = px - cx;
    let dy = py - by;
    return dy >= 0 ? Math.sqrt(dx * dx, dy * dy) : Infinity;
  }

  const getNearestParent = (px, py) => {
    const getParentDist = (parent, px, py) => {
      if (!parent.current) {
        return Infinity;
      }
      const rect = parent.current.getBoundingClientRect();
      let cx = rect.left + window.pageXOffset + rect.width / 2
      let by = rect.top + window.pageYOffset + rect.height
      let dx = px - cx;
      let dy = py - by;
      return dy >= 0 ? Math.sqrt(dx * dx, dy * dy) : Infinity;
    }

    let [target, minDist] = [null, Infinity];
    
    skills.forEach(skill => {
      let dist = getParentDist(buttons[skill.id], px, py);
      if (dist < minDist) {
        target = skill.id;
        minDist = dist;
      }
    });

    return target
  }

  const handleClick = (event) => {
    // Prevent event bubbling
    // Reference: https://www.freecodecamp.org/news/event-propagation-event-bubbling-event-catching-beginners-guide/#what-is-event-delegation
    event.stopPropagation();  
    if (!skills.length) {
      addSkill(id)
      return;
    }
    let target = getNearestParent(event.clientX, event.clientY);
    addSkill(target ? target : id);
  }

  return (
    <SortableContext id={id} items={skills} strategy={horizontalListSortingStrategy}>
      <div ref={setNodeRef} className="skill_node_layer" onClick={handleClick}>
      {skills.map((skill) => (
        skill.parent === id ? 
          <SkillNodeContainer 
            key={skill.id} 
            id={skill.id} 
            title={skill.title} 
            parent={id} 
            skills={skills}
            operateSkills={operateSkills}
            buttons={buttons}
            isDragOverlay={isDragOverlay}
          />
          : null
      ))}
      </div>
    </SortableContext>
  )
}

export default SkillNodeLayer
