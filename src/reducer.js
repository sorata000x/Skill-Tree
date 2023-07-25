import { db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createRef } from 'react';
import { v4 as uuid } from 'uuid'; 
import { arrayMove } from '@dnd-kit/sortable';

const INITIAL_SKILLS = [
  {
    id: uuid(),
    title: "Skill 1",
    level: "0",
    children: [],
    parent: 'root',
  },
  {
    id: uuid(),
    title: "Skill 2",
    level: "10",
    children: [],
    parent: 'root',
  },
  {
    id: uuid(),
    title: "Skill 3",
    level: "50",
    children: [],
    parent: 'root',
  }
]

let INITIAL_BUTTONS = {}
INITIAL_SKILLS.forEach(skill => {
  INITIAL_BUTTONS[skill.id] = createRef()  
})

const userData = {
  skills: JSON.parse(localStorage.getItem("skills"))
}

// Might need to include userData for buttons as well
export const initialState = {
  skills: INITIAL_SKILLS,
  skillsLength: 0,
  user: null,
  buttons: INITIAL_BUTTONS,
}

const setUserData = async (skills) => {
  if (!auth.currentUser) {
    localStorage.setItem("skills", JSON.stringify(skills));
  } else {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      skills: JSON.stringify(skills),
    })
  }
}

const addToParent = (skills, parentId, skill) => {
  // Check for root skills
  let newSkills = JSON.parse(JSON.stringify(skills));
  for(const s of newSkills) {
    if(s.id === parentId) {
      s.children = [...s.children, skill];
      return newSkills;
    }
  }
  // Check for children (recursive)
  for(const s of newSkills) {
    if (s.children) {
      newSkills = addToParent(s.children, parentId, skill)
      if (newSkills) {
        return newSkills;
      }
    }
  }
  // Not found
  return null;
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SIGN_OUT":
      return {
        ...state,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.user
      }
    default:
      return state;
  }
}

export default reducer;