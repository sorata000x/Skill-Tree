import React from 'react'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SkillNodeContainer from './SkillNodeContainer'
import './SkillNodeLayer.css'
import { useDroppable } from '@dnd-kit/core'

/**
 * One row of skill nodes.
 * @param {String} id
 * @param {Array} skills array of all the skill objects
 * @param {Object} buttons keys of skill ids corresponding to their button reference 
 * @param {Function} operateSkills operation on skills (see App.js) 
 * @param {Function} openEdit open skill editing panel 
 * @param {boolean} isDragOverlay whether the layer is used by DragOverlay 
 * @returns 
 */
function SkillNodeLayer({ id, skills, buttons, openEdit, isDragOverlay}) {
  
  const { setNodeRef } = useDroppable({id});

  return (
    <SortableContext 
      id={id} 
      items={skills} 
      strategy={horizontalListSortingStrategy}>
      <div 
        ref={setNodeRef} 
        className="skill_node_layer">
      {skills.map((skill) => (
        skill.parent === id ? 
          <SkillNodeContainer 
            key={skill.id} 
            skill={skill}
            skills={skills}
            buttons={buttons}
            openEdit={openEdit}
            isDragOverlay={isDragOverlay}/>
          : null
      ))}
      </div>
    </SortableContext>
  )
}

export default SkillNodeLayer
