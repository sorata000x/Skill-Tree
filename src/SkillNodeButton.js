import React, { useEffect, useState } from 'react'
import './SkillNodeButton.css';
import { useStateValue } from './StateProvider';

function SkillNodeButton({id}) {
  const [{buttons}, dispatch] = useStateValue();

  return (
    <button className='node_btn' ref={buttons[id]} >
      Node
    </button>
  )
}

export default SkillNodeButton
