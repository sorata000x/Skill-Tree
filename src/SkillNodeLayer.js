import React, { useState, createRef, useEffect } from 'react'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SkillNodeContainer from './SkillNodeContainer'
import './SkillNodeLayer.css'
import { useDroppable } from '@dnd-kit/core'
import { useStateValue } from './StateProvider'
import { v4 as uuid } from 'uuid';

function SkillNodeLayer({ id, skills, operateSkills, buttons }) {
  const { setNodeRef } = useDroppable({id});

  /**
   * Calculates the distance between a point and the bottom of a parent (a node above).
   * (for adding skill node).
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
        title: `${skills.length}`,
        level: 0,
        children: [],
        parent: parentID,
      }
    })
  }

  const handleClick = (event) => {
    // Prevent event bubbling
    // Reference: https://www.freecodecamp.org/news/event-propagation-event-bubbling-event-catching-beginners-guide/#what-is-event-delegation
    console.log(53)
    event.stopPropagation();  
    if (!skills.length) {
      addSkill(id)
      return;
    }
    let [target, minDist] = [null, Infinity];
    skills.forEach(skill => {
      let dist = getParentDist(buttons[skill.id], event.clientX, event.clientY);
      if (dist < minDist) {
        target = skill.id;
        minDist = dist;
      }
    });
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
          />
          : null
      ))}
      </div>
    </SortableContext>
  )
}

export default SkillNodeLayer
