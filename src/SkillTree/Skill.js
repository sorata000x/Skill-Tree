import './Skill.css';
import React, { useState } from 'react';
import SkillTree from './components/SkillTree';
import SkillEdit from './components/SkillEdit';
import { useStateValue } from '../StateProvider';
import { useParams } from "react-router-dom";
import SideBar from './components/SideBar';
import UserAuthDialog from './components/UserAuthDialog';

function Skill() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [{skills, buttons}] = useStateValue();
  const group = useParams().pathParam;
  const [authOpen, setAuthOpen] = useState(false);

  const getSkillByID = (id) => {
    let target = {};
    skills.forEach(skill => {
      if (skill.id === id)
        target = skill;
    })
    return target;
  }

  const handleOpenEdit = (id) => {
    setActiveSkill(getSkillByID(id));
  }

  const handleClickOnSkillTree = (event) => {
    if (activeSkill) {
      setActiveSkill(null);
    }
  }

  return (
    <>
      <div className='skill_container'>
        <SideBar openAuth={()=>setAuthOpen(true)}/>
          <div
            className='skill_tree_outer_container'
            onClick={handleClickOnSkillTree}>
            <SkillTree 
              skills={skills.filter(skill => skill.group === group)} 
              buttons={buttons}
              openEdit={handleOpenEdit}/>
          </div>
          { activeSkill ? 
            <SkillEdit 
              activeSkill={activeSkill} 
              close={()=>setActiveSkill(null)}/> 
            : null}
      </div>
      <UserAuthDialog 
        open={authOpen} 
        close={()=>setAuthOpen(false)}/>
    </>
  );
}

export default Skill
