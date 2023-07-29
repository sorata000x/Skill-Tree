import { db, auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { createRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";

const setUserData = async (data) => {
  if (!auth.currentUser) {
    localStorage.setItem("skills", JSON.stringify(data.skills));
    localStorage.setItem("groups", JSON.stringify(data.groups));
  } else {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      skills: JSON.stringify(data.skills),
      groups: JSON.stringify(data.groups),
    });
  }
};

const emptyState = {
  skills: [],
  activeSkill: null,
  buttons: {},
  groups: [],
  activeGroup: null,
  user: null,
};

const getInitialState = () => {
  const skills = JSON.parse(localStorage.getItem("skills"))
    ? JSON.parse(localStorage.getItem("skills"))
    : [];
  const buttons = {};
  for (const skill of skills) {
    buttons[skill.id] = createRef();
  }
  const groups = JSON.parse(localStorage.getItem("groups"))
    ? JSON.parse(localStorage.getItem("groups"))
    : [];
  return {
    skills: skills,
    activeSkill: null,
    buttons: buttons,
    groups: groups,
    activeGroup: groups.length ? groups[0] : null,
    user: null,
  };
};

export const initialState = getInitialState();

const reducer = (state, action) => {
  switch (action.type) {
    // SKILLS
    case "SET_SKILLS": {
      // relace all the skills with a new set of skills
      let newSkills = action.skills ? action.skills : [];
      for (const skill of newSkills) {
        state.buttons[skill.id] = createRef();
      }
      setUserData({
        ...state,
        skills: [...newSkills],
      });
      return {
        ...state,
        skills: [...newSkills],
      };
    }
    case "SET_SKILL": {
      // set an existing skill
      let index = state.skills.findIndex((skill) => skill.id === action.id);
      state.skills[index] = action.skill;
      setUserData({
        ...state,
      });
      return {
        ...state,
      };
    }
    case "ADD_SKILL": {
      // add a new skill. action = {skill}
      let newSkill = {
        id: uuid(),
        parent: action.parentID,
        children: [],
        title: "",
        level: 0,
        maxLevel: 10,
        increaseBy: 1,
        image: null,
        description: "",
        group: action.group,
      };
      state.buttons[newSkill.id] = createRef();
      setUserData({
        ...state,
        skills: [...state.skills, newSkill],
      });
      return {
        ...state,
        skills: [...state.skills, newSkill],
      };
    }
    case "DROP_SKILL": {
      let activeIndex = state.skills.findIndex(
        (skill) => skill.id === action.active.id
      );
      let overIndex = state.skills.findIndex(
        (skill) => skill.id === action.over.id
      );
      if (state.skills[activeIndex].id !== state.skills[overIndex].parent) {
        state.skills[activeIndex].parent = state.skills[overIndex].parent;
      }
      let newSkills = arrayMove(state.skills, activeIndex, overIndex);
      setUserData({
        ...state,
        skills: newSkills,
      });
      return {
        ...state,
        skills: newSkills,
      };
    }
    case "DELETE_SKILL": {
      const index = state.skills.findIndex((skill) => skill.id === action.id);
      let newSkills = [...state.skills];

      if (index >= 0) {
        // remove skill from index
        newSkills.splice(index, 1);
      } else {
        console.warn(
          `Cant remove skill (id: ${action.id}) as it does not exist.`
        );
      }

      return {
        ...state,
        skills: newSkills,
      };
    }
    case "CLEAR_SKILL": {
      setUserData({
        ...state,
        skills: [],
        buttons: {},
      });
      return {
        ...state,
        skills: [],
        buttons: {},
      };
    }
    case "SET_ACTIVE_SKILL": {
      return {
        ...state,
        activeSkill: action.activeSkill,
      };
    }
    // GROUP
    case "SET_GROUPS": {
      let newGroups = action.groups ? action.groups : [];
      setUserData({
        ...state,
        groups: [...newGroups],
      });
      return {
        ...state,
        groups: [...newGroups],
      };
    }
    case "ADD_NEW_GROUP": {
      setUserData({
        ...state,
        groups: [...state.groups, action.group],
      });
      return {
        ...state,
        groups: [...state.groups, action.group],
      };
    }
    case "SET_ACTIVE_GROUP": {
      const index = state.groups.findIndex((group) => group.id === action.id);
      return {
        ...state,
        activeGroup: index >= 0 ? state.groups[index] : null,
      };
    }
    // AUTHENTICATION
    case "SIGN_OUT": {
      return {
        ...emptyState,
      };
    }
    case "SET_USER": {
      return {
        ...state,
        user: action.user,
      };
    }
    default:
      return state;
  }
};

export default reducer;
