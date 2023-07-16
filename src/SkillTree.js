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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import './SkillTree.css';
import { useStateValue } from './StateProvider';
import { v4 as uuid } from 'uuid';
import SkillNodeButton from './SkillNodeButton';
import SkillNodeContainer from './SkillNodeContainer';

let INITIAL_SKILLS = [
  {
    id: uuid(),
    title: "Skill 1",
    level: "0",
    children: [],
    parent: 'root',
  },
  {
    id: uuid(),
    title: "Skill 2",
    level: "10",
    children: [],
    parent: 'root',
  },
  {
    id: uuid(),
    title: "Skill 3",
    level: "50",
    children: [],
    parent: 'root',
  }
]
let INITIAL_BUTTONS = {}
INITIAL_SKILLS.forEach(skill => {
  INITIAL_BUTTONS[skill.id] = createRef()  
})

function SkillTree() {
  const [skills, setSkills] = useState([]);
  const [buttons, setButtons] = useState([]);

  const operateSkills = (action) => {
    switch (action.type) {
      case "ADD_SKILL": {
        setSkills([...skills, action.skill]);
        buttons[action.skill.id] = createRef();
        break;
      }
      default: {
        return;
      }
    }
  }

  /* Dnd-kit Sortable */

  const [activeSkill, setActiveSkill] = useState({});

  const getSkillByID = (id) => {
    let target = {};
    skills.forEach(skill => {
      if (skill.id === id)
        target = skill;
    })
    return target;
  }
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const dropAnimation = {
    ...defaultDropAnimation,
  }

  const handleDragStart = ({active, over}) => {
    setActiveSkill(getSkillByID(active.id));
  }

  const handleDragOver = ({active, over}) => {
    setActiveSkill(getSkillByID(active.id));
  }

  const handleDragEnd = ({active, over}) => {
    const activeIndex = skills.findIndex((skill) => (skill.id === active.id));
    const overIndex = skills.findIndex((skill) => (skill.id === over.id));
    setSkills(arrayMove(skills, activeIndex, overIndex));
    setActiveSkill(null);
  }

  return (
    <div className='skill_tree_container'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <SkillNodeLayer id='root' skills={skills} operateSkills={operateSkills} buttons={buttons} />
          <DragOverlay dropAnimation={dropAnimation} style={{height: '100%'}}>
            {activeSkill ? 
              <SkillNodeContainer 
                key={activeSkill.id} 
                id={activeSkill.id} 
                title={activeSkill.title} 
                parent={activeSkill.parent} 
                skills={skills}
                operateSkills={operateSkills}
                buttons={buttons}
              />
              : null}
          </DragOverlay>
      </DndContext>
    </div>
  )
}

export default SkillTree
