import { db, auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { createRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";
import type { Data, Skill, Group, Buttons } from "types"
import { User } from "firebase/auth";

// Send current data to storage
const setUserData = async (data: Data) => {
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

const emptyState: Data = {
  skills: [],
  activeSkill: null,
  buttons: {},
  groups: [],
  activeGroup: null,
  user: null,
};

// Get initial state from local storage or set to empty
const getInitialState = (): Data => {
  // Reference: [StackOverflow] Argument of type 'string | null' is not assignable to parameter of type 'string'. Type 'null' is not assignable to type 'string' | https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
  const skills: Array<Skill> = JSON.parse(localStorage.getItem("skills") || '{}')
    ? JSON.parse(localStorage.getItem("skills") || '{}')
    : [];
  const buttons: Buttons = {};
  for (const skill of skills) {
    buttons[skill.id] = createRef();
  }
  const groups = JSON.parse(localStorage.getItem("groups") || '{}')
    ? JSON.parse(localStorage.getItem("groups") || '{}')
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

export const initialState: Data = getInitialState();

export interface Action {
  type: string,
  id?: string,
  skill?: Skill,
  skills?: Array<Skill>,
  parentID?: string,
  group?: Group,
  active?: Skill,
  over?: Skill,
  activeSkill?: Skill,
  groups: Array<Group>,
  name: string,
  user: User,
}

const reducer = (state: Data, action: Action) => {
  switch (action.type) {
    // SKILLS
    case "SET_SKILLS": {
      if (!action.skills) {
        console.error('Operation SET_SKILLS requires {skills} attribute');
        return;
      }
      // relace all the skills with a new set of skills
      let newSkills = action.skills;
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
      if (!action.id || !action.skill) {
        console.error('Operation SET_SKILL requires {id, skill} attributes');
        return;
      }
      // Set an existing skill
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
      if (!action.parentID || !action.group) {
        console.error('Operation ADD_SKILL requires {parentID, group} attribute');
        return;
      }
      // add a new skill. action = {skill}
      let newSkill: Skill = {
        id: uuid(),
        parent: action.parentID,
        children: [],
        title: "",
        level: 0,
        maxLevel: 10,
        increaseBy: 1,
        image: '',
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
      if (!action.active || !action.over) {
        console.error('Operation DROP_SKILL requires {active, over} attributes');
        return;
      }
      // Whether node1 is descendent of node2
      const isDescendent = (node1: Skill, node2: Skill) => {
        let current = node1;
        for (const _ of state.skills) {
          if (current.parent === 'root') {
            return false;
          }
          if (node2.id === current.parent) {
            return true;
          }
          for (const skill of state.skills) {
            if (skill.id === current.parent) {
              current = skill;
            }
          }
        }
        return false;
      }
      let activeIndex = state.skills.findIndex(
        (skill) => skill.id === action.active?.id
      );
      let overIndex = state.skills.findIndex(
        (skill) => skill.id === action.over?.id
      );
      // Prevent dropping to a descendent
      if (!isDescendent(state.skills[overIndex], state.skills[activeIndex])) {
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
      if (!action.id) {
        console.error('Operation DELETE_SKILL requires {id} attribute');
        return;
      }

      const index = state.skills.findIndex((skill) => skill.id === action.id);
      let newSkills = [...state.skills];

      if (index >= 0) {
        // Update children's parent to skill's parent
        for (let i=0; i < newSkills.length; i++) {
          if (newSkills[i].parent === newSkills[index].id) {
            newSkills[i].parent = newSkills[index].parent;
            // Move children to skill's original position
            newSkills = arrayMove(newSkills, i, index)
          }
        }
        // Remove skill from index
        newSkills.splice(index, 1);
      } else {
        console.warn(
          `Cant remove skill (id: ${action.id}) as it does not exist.`
        );
      }
      setUserData({
        ...state,
        skills: newSkills,
      });
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
      if (!action.activeSkill) {
        console.error('Operation SET_ACTIVE_SKILL requires {activeSkill} attribute');
        return;
      }

      return {
        ...state,
        activeSkill: action.activeSkill,
      };
    }
    // GROUP
    case "SET_GROUPS": {
      if (!action.groups) {
        console.error('Operation SET_GROUPS requires {groups} attribute');
        return;
      }

      let newGroups = action.groups;
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
      if (!action.group) {
        console.error('Operation ADD_NEW_GROUP requires {group} attribute');
        return;
      }

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
      if (!action.id) {
        console.error('Operation SET_ACTIVE_GROUP requires {id} attribute');
        return;
      }

      const index = state.groups.findIndex((group) => group.id === action.id);
      return {
        ...state,
        activeGroup: index >= 0 ? state.groups[index] : null,
      };
    }
    case "SET_GROUP_NAME": {
      if (!action.id || !action.name) {
        console.error('Operation SET_GROUP_NAME requires {id, name} attribute');
        return;
      }

      const index = state.groups.findIndex((group) => group.id === action.id);
      state.groups[index].name = action.name;
      return {
        ...state,
        groups: [...state.groups]
      }
    }
    // AUTHENTICATION
    case "SIGN_OUT": {
      return {
        ...emptyState,
      };
    }
    case "SET_USER": {
      if (!action.user) {
        console.error('Operation SET_USER requires {user} attribute');
        return;
      }

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
