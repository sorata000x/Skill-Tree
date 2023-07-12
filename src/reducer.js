import { db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createRef } from 'react';
import { v4 as uuid } from 'uuid'; 

const INITIAL_SKILLS = [
  {
    id: uuid(),
    title: "Skill 1",
    level: "0",
    children: [],
  },
  {
    id: uuid(),
    title: "Skill 2",
    level: "10",
    children: [],
  },
  {
    id: uuid(),
    title: "Skill 3",
    level: "50",
    children: [],
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
  skills: userData.skills ? userData.skills : INITIAL_SKILLS,
  user: null,
  buttons: INITIAL_BUTTONS
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

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_SKILL":
      setUserData([...state.skills, action.skill]);
      let newButtons = state.buttons;
      newButtons[action.skill.id] = createRef();
      return {
        ...state,
        skills: [...state.skills, action.skill],
      }
    default:
      return state;
  }
}

export default reducer;