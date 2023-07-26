import './Skill.css';
import React, { useEffect, useState } from 'react';
import SkillTree from './components/SkillTree';
import SkillEdit from './components/SkillEdit';
import { auth } from '../firebase';
import { useStateValue } from '../StateProvider';
import { Link, useParams } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SideBar from './components/SideBar';

function Skill() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [{user, skills, buttons}, dispatch] = useStateValue();
  const group = useParams().pathParam;

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

  const UserButton = () => {
    const handleAuthentication = () => {
      if (user) {
        auth.signOut();
        dispatch({
          type: "SIGN_OUT",
        })
        dispatch({
          type: "CLEAR_SKILL",
        })
      }
    }
    const Login = () => {
      return (
        <Link to={!user && '/login'}>
          <IconButton 
            size="large">
            <AccountCircleIcon 
              fontSize="large" />
          </IconButton>
        </Link>
      )
    }
    const Info = () => {
      return (
        <IconButton 
          size="large" 
          onClick={handleAuthentication}>
          <AccountCircleIcon 
            className="active" 
            fontSize="large" />
        </IconButton>
      )
    }

    return (
      <div className='user_btn'>
        {user ? <Info /> : <Login />}
      </div>
    )
  }

  return (
    <>
      <div className='skill_container'>
        <SideBar />
        {group ? <div
          className='skill_tree_outer_container'
          onClick={handleClickOnSkillTree}>
          <SkillTree 
            skills={skills.filter(skill => skill.group === group)} 
            buttons={buttons}
            openEdit={handleOpenEdit}/>
        </div> : null }
        { activeSkill ? 
          <SkillEdit 
            activeSkill={activeSkill} 
            close={()=>setActiveSkill(null)}/> 
          : null}
      </div>
    </>
  );
}

export default Skill
