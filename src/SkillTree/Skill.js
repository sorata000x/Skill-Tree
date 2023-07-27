import './Skill.css';
import React, { useState } from 'react';
import SkillTree from './components/SkillTree';
import SkillEdit from './components/SkillEdit';
import { useStateValue } from '../StateProvider';
import { useParams } from "react-router-dom";
import SideBar from './components/SideBar';
import UserAuthDialog from './components/UserAuthDialog';

function Skill() {
  const [{skills, activeSkill}, dispatch] = useStateValue();
  const group = useParams().pathParam;
  const [authOpen, setAuthOpen] = useState(false);

  const handleClick = (event) => {
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    })
  }

  return (
    <>
      <div 
        className='skill_container'
        onClick={handleClick}>
        <SideBar openAuth={()=>setAuthOpen(true)}/>
          <div
            className='skill_tree_outer_container'>
            <SkillTree 
              skills={skills.filter(skill => skill.group === group)}/>
          </div>
          { activeSkill ? 
            <SkillEdit /> 
            : null}
      </div>
      <UserAuthDialog 
        open={authOpen} 
        close={()=>setAuthOpen(false)}/>
    </>
  );
}

export default Skill
