import './Skill.css';
import React, { useState, createRef, useEffect } from 'react';
import SkillTree from './components/SkillTree';
import SkillEdit from './components/SkillEdit';
import { arrayMove } from '@dnd-kit/sortable';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useStateValue } from '../StateProvider';
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function Skill() {
  const [skills, setSkills] = useState([]);
  const [buttons, setButtons] = useState({});
  const [activeSkill, setActiveSkill] = useState(null);
  const [{user}, dispatch] = useStateValue();
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial skills and buttons
    const initialSkills = JSON.parse(localStorage.getItem("skills"));
    if (initialSkills) {
      operateSkills({
        type: "SET_SKILLS",
        skills: initialSkills
      })
    }
  }, [])

  useEffect(() => {
    // Get user skills once logged in
    const getUserSkills = async () => {
      let userDoc = await getDoc(doc(db, "users", user?.uid))
      if (userDoc.data()) {
        let userSkills = userDoc.data().skills ? userDoc.data().skills : '[]';
        userSkills = JSON.parse(userSkills)
        operateSkills({
          type: "SET_SKILLS",
          skills: userSkills
        })
      }
    }
    if(user) {
      getUserSkills()
    }
  }, [user])

  /**
   * Operation to modify the skills.
   * @param {Object} action type and data for the operation
   * @returns 
   */
  const operateSkills = (action) => {
    const setUserSkills = async (skills) => {
      if (!auth.currentUser) {
        localStorage.setItem("skills", JSON.stringify(skills))
      } else {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          skills: JSON.stringify(skills),
        })
      }
    }
    switch (action.type) {
      // Relace all the skills with a new set of skills
      case "SET_SKILLS": {
        const newSkills = action.skills ? action.skills : [];
        setSkills([...newSkills])
        for(const skill of newSkills) {
          buttons[skill.id] = createRef();
        }
        break;
      }
      // Set an existing skill. action = {id, skill}
      case "SET_SKILL": {
        let index = skills.findIndex(skill => (skill.id === action.id));
        skills[index] = action.skill;
        setSkills([...skills]);
        setUserSkills([...skills]);
        break;
      }
      // Add a new skill. action = {skill}
      case "ADD_SKILL": {
        setSkills([...skills, action.skill]);
        setUserSkills([...skills, action.skill]);
        buttons[action.skill.id] = createRef();
        break;
      }
      // Drop an active skill to an over skill
      case "DROP_SKILL": {
        let activeIndex = skills.findIndex(skill => (skill.id === action.active.id));
        let overIndex = skills.findIndex(skill => (skill.id === action.over.id));
        if (skills[activeIndex].id !== skills[overIndex].parent) {
          skills[activeIndex].parent = skills[overIndex].parent;
        }
        const newSKills = arrayMove(skills, activeIndex, overIndex);
        setSkills(newSKills);
        setUserSkills(newSKills);
        break;
      }
      default: {
        return;
      }
    }
  }

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
        navigate('/');
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
      <UserButton />
      <div
        className='skill_tree_outer_container'
        onClick={handleClickOnSkillTree}>
        <SkillTree 
          skills={skills} 
          buttons={buttons} 
          operateSkills={operateSkills} 
          openEdit={handleOpenEdit}/>
      </div>
      { activeSkill ? 
        <SkillEdit 
          activeSkill={activeSkill} 
          operateSkills={operateSkills} 
          close={()=>setActiveSkill(null)}/> 
        : null}
    </>
  );
}

export default Skill
