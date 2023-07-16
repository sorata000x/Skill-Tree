import React, { useEffect, useState } from 'react'
import './SkillNodeButton.css';
import { useStateValue } from './StateProvider';

function SkillNodeButton({id, title, listeners, buttonRef}) {

  return (
    <button className='node_btn' ref={buttonRef} {...listeners} >
      {title}
    </button>
  )
}

export default SkillNodeButton
