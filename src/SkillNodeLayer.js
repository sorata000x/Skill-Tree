import React, { createRef } from 'react'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SkillNodeContainer from './SkillNodeContainer'
import './SkillNodeLayer.css'
import { useDroppable } from '@dnd-kit/core'
import { useStateValue } from './StateProvider'
import { v4 as uuid } from 'uuid';

function SkillNodeLayer({ id, nodes, parentId }) {
  const [{}, dispatch] = useStateValue();
  const { setNodeRef } = useDroppable({id});

  const addSkill = () => {
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

  return (
    <SortableContext id={id} items={nodes} strategy={horizontalListSortingStrategy}>
      <div ref={setNodeRef} className="skill_node_layer" onClick={addSkill}>
      {nodes.map((skill) => (
          <SkillNodeContainer key={skill.id} id={skill.id} children={skill.children}/>
      ))}
      </div>
    </SortableContext>
  )
}

export default SkillNodeLayer
