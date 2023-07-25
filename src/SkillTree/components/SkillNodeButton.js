import React, { useState } from 'react'
import './SkillNodeButton.css';
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';

/**
 * A button of skill node.
 * @param {Object} skill of this button
 * @param {Ref} buttonRef button reference associated with the skill 
 * @param {Function} operateSkills operation on skills (see App.js)  
 * @param {Function} openEdit open skill editing panel 
 * @param {Object} listeners listeners for dnd-kit sortable dragging function 
 * @returns 
 */
function SkillNodeButton({skill, buttonRef, operateSkills, openEdit, listeners}) {

  const [isMouseOver, setMouseOver] = useState(false);

  /**
   * Set the level of the skill for this button.
   * @param {Number} level 
   */
  const setLevel = (level) => {
    skill.level = level;
    operateSkills({
      type: 'SET_SKILL',
      id: skill.id,
      skill: skill
    })
  }

  const LevelChangeButtons = () => {
    const increaseLevel = (e) => {
      if (skill.level <= skill.maxLevel) {
        setLevel(skill.level+1)
      }
    }
    const decreaseLevel = (e) => {
      if (skill.level > 0) {
        setLevel(skill.level-1);
      }
    }
    return <div 
            className='level_change_container'>
             <button 
               className='level_change_button'
               onClick={increaseLevel}
               onDoubleClick={(e)=>{e.stopPropagation()}}>
                <HiOutlinePlus 
                  className='level_change_icon' 
                  size={24}/>
             </button>
             <div 
              className='level_change_divider'/>
             <button 
               className='level_change_button'
               onClick={decreaseLevel}
               onDoubleClick={(e)=>{e.stopPropagation()}}>
                <HiOutlineMinus 
                  className='level_change_icon' 
                  size={24}/>  
             </button>
           </div>
  }

  const handleClick = (e) => {
    e.stopPropagation();
    openEdit(skill.id);
  }

  return (
    <div 
      className='skill_node_button_container'
      onMouseOver={(e)=>{setMouseOver(true)}} 
      onMouseLeave={(e)=>{setMouseOver(false);}}>
      <button 
        className='skill_node_button' 
        ref={buttonRef} 
        onClick={handleClick} 
        {...listeners}>
        <div 
          className='skill_node_title'> 
          {skill.id} 
        </div>
        <div 
          className='skill_node_level_container'>
          <div 
            className='skill_node_level' 
            style={{ height: `${skill.level/skill.maxLevel*80}px` }}/>
        </div>
      </button>
      { isMouseOver ? <LevelChangeButtons /> : null }
    </div>
  )
}

export default SkillNodeButton
