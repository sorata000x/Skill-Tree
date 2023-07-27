import React from 'react'
import './SkillEdit.css';
import CloseIcon from '@mui/icons-material/Close';
import { useStateValue } from '../../StateProvider';

/**
 * A panel to edit a skill.
 * @param {Object} activeSkill a skill to be edited
 * @param {Function} operateSkills operation on skills (see App.js)
 * @param {Function} close close this panel
 * @returns 
 */
function SkillEdit() {
  const [{activeSkill}, dispatch] = useStateValue();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    })
  };

  const handleChange = (type, value) => {
    switch (type) {
      case "title": {
        activeSkill.title = value;
        break;
      }
      case "level": {
        activeSkill.level = value;
        break;
      }
      case "maxLevel": {
        activeSkill.maxLevel = value;
        break;
      }
      case "description": {
        activeSkill.description = value;
        break;
      }
      default: {
        return
      }
    }

    dispatch({
      type: 'SET_SKILL',
      id: activeSkill.id,
      skill: activeSkill,
    })
  }

  const close = () => {
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    })
  }

  return (
    <div 
      className='skill_edit_container'
      onClick={(e)=>e.stopPropagation()}>
      <CloseIcon 
        className='close_icon' 
        onClick={close}/>
      <form 
        className='skill_edit_form'
        onSubmit={handleSubmit}>
          <div 
            className="form-group">
            <label 
              for="title">
                Title
            </label>
            <input 
              id="title"
              className="form-control" 
              type="text"
              autoComplete='off'
              value={activeSkill.title}
              onChange={(e)=>handleChange('title', e.target.value)}/>
          </div>
          <div 
            className="form-group">
            <label 
              for="level">
                Level
            </label>
            <div 
              className='level_inputs_container'>
              <input 
                id="level"
                className="form-control level_input" 
                type="number"
                autoComplete='off'
                min={0}
                max={`${activeSkill.maxLevel}`}
                value={activeSkill.level}
                onChange={(e)=>handleChange('level', e.target.value)}/>
              /
              <input 
                id="level"
                className="form-control level_input" 
                type="number"
                autoComplete='off'
                min={0}
                value={activeSkill.maxLevel}
                onChange={(e)=>handleChange('maxLevel', e.target.value)}/>
            </div>
          </div>
          <div 
            className="form-group">
            <label 
              for="description">
                Description
            </label>
            <textarea 
              id="description" 
              className="form-control description" 
              rows="3"
              autoComplete='off'
              value={activeSkill.description}
              onChange={(e)=>handleChange('description', e.target.value)}/>
          </div>
          <div 
            className="action">
            <button 
              className='abtn abtn_add'
              type="submit">
                OK
            </button>
            <button 
              className='abtn abtn_cancel' 
              type="button" 
              onClick={close}>
                Cancel
            </button>
          </div>
        </form>
    </div>
  )
}

export default SkillEdit
