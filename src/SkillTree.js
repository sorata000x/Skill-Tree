import React, { useState, createRef, useEffect } from 'react'
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

  useEffect(() => {
    buttons['drag-overlay'] = createRef();
  }, [])

  const operateSkills = (action) => {
    switch (action.type) {
      case "ADD_SKILL": {
        setSkills([...skills, action.skill]);
        buttons[action.skill.id] = createRef();
        break;
      }
      case "CHANGE_PARENT": {
        console.log('switching parent')
        let fromIndex = skills.findIndex(skill => ( skill.id === action.from ))
        skills[fromIndex].parent = action.parent
        break;
      }
      default: {
        return;
      }
    }
  }

  const getNearestParent = (id) => {
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

    const rect = buttons[id].current.getBoundingClientRect();
    let [target, minDist] = [null, Infinity];
    
    skills.forEach(skill => {
      let dist = getParentDist(buttons[skill.id], rect.left+rect.width/2, rect.top+rect.height/2);
      if (dist < minDist && skill.id !== id) {
        target = skill.id;
        minDist = dist;
      }
    });

    return target
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
    const parent = getNearestParent(active.id);
    operateSkills({
      type: "CHANGE_PARENT", 
      from: active.id, 
      parent: parent ? parent : 'root',
    })
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
                isDragOverlay={true}
              />
              : null}
          </DragOverlay>
      </DndContext>
    </div>
  )
}

export default SkillTree
