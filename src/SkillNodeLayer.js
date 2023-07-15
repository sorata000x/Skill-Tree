import React, { useState, createRef, useEffect } from 'react'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SkillNodeContainer from './SkillNodeContainer'
import './SkillNodeLayer.css'
import { useDroppable } from '@dnd-kit/core'
import { useStateValue } from './StateProvider'
import { v4 as uuid } from 'uuid';

function SkillNodeLayer({ id, handleTransition }) {
  const [{skills, skillsLength, buttons}, dispatch] = useStateValue();
  const { setNodeRef } = useDroppable({id});
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    setNodes(skills.filter(skill => skill.parent === id))
  }, [skills])

  /**
   * Calculates the distance between a point and the bottom of a parent (a node above).
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
    dispatch({
      type: "ADD_SKILL",
      skill: {
        id: skillID,
        title: `${skillsLength}`,
        level: 0,
        children: [],
        parent: parentID,
      }
    })
  }

  const handleClick = (event) => {
    // Prevent event bubbling
    // Reference: https://www.freecodecamp.org/news/event-propagation-event-bubbling-event-catching-beginners-guide/#what-is-event-delegation
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
    <SortableContext id={id} items={nodes} strategy={horizontalListSortingStrategy}>
      <div ref={setNodeRef} className="skill_node_layer" onClick={handleClick}>
      {nodes.map((skill) => (
        <SkillNodeContainer key={skill.id} id={skill.id} title={skill.title} parent={id} handleTransition={handleTransition}/>
      ))}
      </div>
    </SortableContext>
  )
}

export default SkillNodeLayer
