import React, { useEffect, useState } from 'react'
import './SkillNodeButton.css';
import { useStateValue } from './StateProvider';

function SkillNodeButton({id, title}) {
  const [{buttons}, dispatch] = useStateValue();

  return (
    <button className='node_btn' ref={buttons[id]} >
      {title}
    </button>
  )
}

export default SkillNodeButton
