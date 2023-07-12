import React, { createRef } from 'react'
import { useStateValue } from './StateProvider'
import { v4 as uuid } from 'uuid';

function SkillTreeBackground() {
  const INFINITY = 99999;
  const [{skills, user}, dispatch] = useStateValue();

  const addSkill = (parentId) => {
    console.log('add skill')
    dispatch({
      type: "ADD_SKILL",
      parent: parentId,
      skill: {
        id: uuid(),
        title: 'Node',
        level: 0,
        children: [],
        ref: createRef(),
      }
    })
  }

  /**
   * Calculates the distance between a point and the bottom of an element above it.
   * @param {*} el element reference 
   * @param {*} px point x coordinate
   * @param {*} py point y coordinate
   * @returns distance between element and point; INFINITY if element bottom is below the point.
   */
  const getParentDist = (el, px, py) => {
    const rect = el.current.getBoundingClientRect();
    let bx = rect.left + window.pageXOffset + rect.width / 2
    let by = rect.top + window.pageYOffset + rect.height / 2
    let dx = px - bx;
    let dy = py - by;
    return dy >= 0 ? Math.sqrt(dx * dx, dy * dy) : INFINITY;
  }

  const handleClick = (event) => {
    // Add to root if there is no more skill
    if (!skills) {
      addSkill();
      return;
    }
    let [target, minDist] = [null, INFINITY];
    skills.array.forEach(skill => {
      let dist = getParentDist(skill.ref, event.clientX, event.clientY);
      if (dist !== null && dist < minDist) {
        target = skill;
        minDist = dist;
      }
    });
    addSkill(target);
  }

  return (
    <div className="skill_tree_background" onClick={handleClick}>
      
    </div>
  )
}

export default SkillTreeBackground
