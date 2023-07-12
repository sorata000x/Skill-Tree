import React, { createRef, useEffect } from 'react'
import SkillNodeButton from './SkillNodeButton'
import './SkillNodeContainer.css'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import SkillNodeLayer from './SkillNodeLayer';
import {v4 as uuid} from 'uuid';
import { useStateValue } from './StateProvider';

function SkillNodeContainer({id, children}) {
  const [{skills, user, buttons}, dispatch] = useStateValue();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable( id );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className='skill_node_container' style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <SkillNodeButton id={id} />
      { children.length ? <SkillNodeLayer /> : null }
    </div>
  )
}

export default SkillNodeContainer
