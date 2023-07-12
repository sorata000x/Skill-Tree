import React, { useState, createRef } from 'react'
import SkillNodeLayer from './SkillNodeLayer'
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  closestCenter,
  closestCorners
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import './SkillTree.css';
import { useStateValue } from './StateProvider';
import { v4 as uuid } from 'uuid';

function SkillTree() {
  const INFINITY = 99999;
  const [{skills, buttons, user}, dispatch] = useStateValue();

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
    skills.forEach(skill => {
      let dist = getParentDist(buttons[skill.id], event.clientX, event.clientY);
      if (dist !== null && dist < minDist) {
        target = skill;
        minDist = dist;
      }
    });
    addSkill(target);
  }

  /* Dnd-kit Sortable */

  const [activeSkillId, setActiveSkillId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (active) => {
    setActiveSkillId(active.id);
    console.log('drag start')
  }

  const handleDragOver = (active, over) => {
    // Find the containers
    console.log('drag over')
  }

  const handleDragEnd = () => {
    setActiveSkillId(null);
    console.log('drag end')
  }

  return (
    <div className='skill_tree_container' onClick={handleClick}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <SkillNodeLayer id={"container"} nodes={skills} />
      </DndContext>
    </div>
  )
}

export default SkillTree
