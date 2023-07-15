import React, { useState, useEffect } from 'react'
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
  closestCorners,
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import './SkillTree.css';
import { useStateValue } from './StateProvider';
import { v4 as uuid } from 'uuid';
import SkillNodeButton from './SkillNodeButton';
import {CSS} from '@dnd-kit/utilities';

function SkillTree() {
  const [{skills}, dispatch] = useStateValue();
  const [rootSkills, setRootSkills] = useState();

  /* Dnd-kit Sortable */

  const [activeSkillID, setActiveSkillID] = useState();
  const [activeSkillTitle, setActiveSkillTitle] = useState('');
  const [activeSkill, setActiveSkill] = useState({});
  const [overSkillID, setOverSkillID] = useState();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = ({active, over}) => {
    setActiveSkillID(active.id);
    setActiveSkill(getSkillByID(active.id));
    
    console.log('drag start')
  }

  const handleDragOver = ({active, over}) => {
    // Find the containers
    console.log('dragover')
    setOverSkillID(over.id);
  }

  const handleDragEnd = ({active, over}) => {
    
    console.log('drag end')
    console.log(`active.id: ${active.id} over.id: ${over.id}`)
    dispatch({
      type: "MOVE_SKILLS",
      active: active.id,
      over: over.id,
    })
    setActiveSkillID(null);
    setActiveSkill(null);
  }

  const defaultKeyframeResolver = ({
    transform: {initial, final},
  }) => [
    {
      transform: CSS.Transform.toString(initial),
    },
    {
      transform: CSS.Transform.toString(final),
    },
  ];

  const dropAnimation = {
    duration: 200,
    easing: 'ease',
    keyframes: defaultKeyframeResolver,
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0',
        },
      },
    }),
    
  }

  const getSkillByID = (id) => {
    let target = {};
    skills.forEach(skill => {
      if (skill.id === id)
        target = skill;
    })
    return target;
  }

  useEffect(() => {
    console.log(`activeSkillTitle: ${activeSkillTitle}`)
  }, [activeSkillTitle])

  const handleTransition = () => {
    console.log('85')
    if(!activeSkillID || !overSkillID) {
      return;
    }
    console.log(`switch ${activeSkillID} with ${overSkillID}`)
    dispatch({
      type: "MOVE_SKILLS",
      active: activeSkillID,
      over: overSkillID,
    })
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
        <SkillNodeLayer id='root' handleTransition={handleTransition} />
        <div className="skill_node_layer">
            <DragOverlay dropAnimation={dropAnimation}>
              {activeSkillID ? 
                <div className='skill_node_container' >
                  <SkillNodeButton id={activeSkillID} title={activeSkill.title} />
                  <SkillNodeLayer id={activeSkillID} handleTransition={handleTransition} />
                </div>
                : null}
            </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}

export default SkillTree
