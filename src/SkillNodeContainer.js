import React, { useState, useEffect } from 'react'
import SkillNodeButton from './SkillNodeButton'
import './SkillNodeContainer.css'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import SkillNodeLayer from './SkillNodeLayer';
import {v4 as uuid} from 'uuid';

function SkillNodeContainer({id, title, parent, skills, operateSkills, buttons, isDragOverlay}) {
  const [time, setTime] = useState(new Date());
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable( {
    id: id,
    transition: {duration: 300, easing: 'ease'}
  } );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const addSkill = () => {
    const skillID = uuid()
    operateSkills({
      type: "ADD_SKILL",
      skill: {
        id: skillID,
        title: `${skillID}`,
        level: 0,
        children: [],
        parent: parent,
      }
    })
  }

  const handleClick = (event) => {
    // Prevent event bubbling
    // Reference: https://www.freecodecamp.org/news/event-propagation-event-bubbling-event-catching-beginners-guide/#what-is-event-delegation
    event.stopPropagation();
    addSkill();
  }

  return (
    <div ref={setNodeRef} style={style} onClick={handleClick} >
      <div className='skill_node_container' onClick={handleClick} >
        <SkillNodeButton id={id} title={title} listeners={listeners} buttonRef={buttons[id]} isDragOverlay={isDragOverlay}/>
        <SkillNodeLayer id={id} skills={skills} operateSkills={operateSkills} buttons={buttons} isDragOverlay={isDragOverlay} />
        
      </div>

    </div>
  )
}

export default SkillNodeContainer
