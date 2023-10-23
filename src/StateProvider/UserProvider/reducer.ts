import { db, auth } from "_firebase";
import { doc, setDoc } from "firebase/firestore";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";
import type { Skill, ActionSkill, Group, Action } from "types";
import { User } from "firebase/auth";
import { emptyData, emptySkill, emptyGroup } from "./data";

// For getting user data, see App.tsx

export interface StateData {
  user: User | null;
  theme: string;
  skills: Array<Skill>;
  groups: Array<Group>;
  actions: Array<Action>;
}

export interface StateAction {
  type: string;
  user?: User;
  theme?: string;
  skills?: Array<Skill>;
  id?: string;
  skill?: Skill;
  parentID?: string;
  group?: Group;
  name?: string;
  active?: Skill;
  over?: Skill;
  treeOpen?: boolean;
  groups?: Array<Group>;
  action: Action;
}

// Send current data to local storage / firebase
const setUserData = async (data: StateData) => {
  if (!auth.currentUser) {
    localStorage.setItem("theme", data.theme);
    localStorage.setItem("skills", JSON.stringify(data.skills));
    localStorage.setItem("groups", JSON.stringify(data.groups));
    localStorage.setItem("actions", JSON.stringify(data.actions));
  } else {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      theme: data.theme,
      skills: JSON.stringify(data.skills),
      groups: JSON.stringify(data.groups),
      actions: JSON.stringify(data.actions),
    });
  }
};

// Get initial state from local storage or initialize with empty data
const getInitialState = (): StateData => {
  // Get data from local storage if data exist
  // Reference: [StackOverflow] Argument of type 'string | null' is not assignable to parameter of type 'string'. Type 'null' is not assignable to type 'string' | https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
  const theme: string = localStorage.getItem("theme") || "light";
  const skills: Array<Skill> = JSON.parse(localStorage.getItem("skills") || "[]");
  const groups = JSON.parse(localStorage.getItem("groups") || "[]");
  const actions: Array<Action> = JSON.parse(localStorage.getItem("actions") || "[]");
  return {
    user: null,
    theme: theme,
    skills: skills,
    groups: groups,
    actions: actions,
  }
};

export const initialState: StateData = getInitialState();

const reducer = (state: StateData, action: StateAction): StateData => {
  switch (action.type) {
    // AUTHENTICATION
    case "SIGN_OUT": {
      console.debug("SIGN_OUT");
      return {
        ...emptyData,
      };
    }
    case "SET_USER": {
      console.debug("SET_USER");
      if (action.user === undefined) {
        console.error("Operation SET_USER requires {user} attribute");
        return state;
      }
      return {
        ...state,
        user: action.user,
      };
    }
    // THEME
    case "SET_THEME": {
      console.debug("SET_THEME");
      if (action.theme === undefined) {
        console.error("Operation SET_THEME requires {theme} attribute");
        return state;
      }
      console.debug(`SET THEME TO {${action.theme}}`);
      setUserData({
        ...state,
        theme: action.theme,
      });
      return {
        ...state,
        theme: action.theme,
      };
    }
    // SKILLS
    case "SET_SKILLS": {
      console.debug("SET_SKILLS");
      if (action.skills === undefined) {
        console.error("Operation SET_SKILLS requires {skills} attribute");
        return state;
      }
      console.debug(`SET SKILLS TO {${action.skills}}`);
      // Replace all the skills with a new set of skills
      let newSkills = action.skills;
      for (let i = 0; i < newSkills.length; i++) {
        newSkills[i] = {
          ...emptySkill, // pre-define all properties (data patch)
          ...newSkills[i],
        };
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
      console.debug("SET_SKILL");
      if (action.id === undefined || action.skill === undefined) {
        console.error("Operation SET_SKILL requires {id, skill} attributes");
        return state;
      }
      // Set an existing skill
      let newSkills = [...state.skills];
      let index = newSkills.findIndex((skill) => skill.id === action.id);
      newSkills[index] = action.skill;
      setUserData({
        ...state,
        skills: [...newSkills],
      });
      return {
        ...state,
        skills: [...newSkills],
      };
    }
    case "ADD_SKILL": {
      console.debug("ADD_SKILL");
      if (action.parentID === undefined || action.group === undefined) {
        console.error(
          "Operation ADD_SKILL requires {parentID, group} attribute"
        );
        return state;
      }
      // add a new skill. action = {skill}
      let newSkill: Skill = {
        id: action.id ? action.id : uuid(),
        parent: action.parentID,
        title: action.name ? action.name : "",
        level: 0,
        maxLevel: 0,
        increaseBy: 1,
        description: "",
        group: action.group,
        treeOpen: true,
      };
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
      // Change the position of skill node (dnd-kit sortable)
      console.debug("DROP_SKILL");
      if (action.active === undefined || action.over === undefined) {
        console.error(
          "Operation DROP_SKILL requires {active, over} attributes"
        );
        return state;
      }
      // Whether node1 is descendent of node2
      const isDescendent = (node1: Skill, node2: Skill) => {
        let current = node1;
        for (const _ of state.skills) {
          if (current.parent === "root") {
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
      };
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
      console.debug("DELETE_SKILL");
      if (action.id === undefined) {
        console.error("Operation DELETE_SKILL requires {id} attribute");
        return state;
      }
      const index = state.skills.findIndex((skill) => skill.id === action.id);
      let newSkills = [...state.skills];
      if (index >= 0) {
        // Update children's parent to skill's parent
        for (let i = 0; i < newSkills.length; i++) {
          if (newSkills[i].parent === newSkills[index].id) {
            newSkills[i].parent = newSkills[index].parent;
            // Move children to skill's original position
            newSkills = arrayMove(newSkills, i, index);
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
      console.debug("CLEAR_SKILL");
      setUserData({
        ...state,
        skills: [],
      });
      return {
        ...state,
        skills: [],
      };
    }
    case "SET_SKILL_TREE_OPEN": {
      console.debug("SET_SKILL_TREE_OPEN");
      if (action.id === undefined || action.treeOpen === undefined) {
        console.error(
          "Operation SET_SKILL_TREE_OPEN requires {id, treeOpen} attributes"
        );
        return state;
      }
      let newSkills = [...state.skills];
      for (const skill of newSkills) {
        if (skill.id === action.id) {
          skill.treeOpen = action.treeOpen;
        }
      }
      return {
        ...state,
        skills: [...newSkills],
      };
    }
    // GROUPS
    case "SET_GROUPS": {
      console.log("SET_GROUPS");
      if (action.groups === undefined) {
        console.error("Operation SET_GROUPS requires {groups} attribute");
        return state;
      }
      let newGroups = action.groups;
      // Patch data
      newGroups.forEach(g => {
        g = {
          ...emptyGroup,
          ...g
        }
      })
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
      console.debug("ADD_NEW_GROUP");
      if (!action.group) {
        console.error("Operation ADD_NEW_GROUP requires {group} attribute");
        return state;
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
    case "SET_GROUP_NAME": {
      console.debug("SET_GROUP_NAME");
      if (action.id === undefined || action.name === undefined) {
        console.error("Operation SET_GROUP_NAME requires {id, name} attribute");
        return state;
      }
      const index = state.groups.findIndex((group) => group.id === action.id);
      if(index < 0) return state;
      state.groups[index].name = action.name;
      setUserData({
        ...state,
        groups: [...state.groups],
      });
      return {
        ...state,
        groups: [...state.groups],
      };
    }
    case "SET_GROUP": {
      console.debug("SET_GROUP");
      if (action.group === undefined) {
        console.error("Operation SET_GROUP requires {group} attribute");
        return state;
      }
      const index = state.groups.findIndex((group) => group.id === action.group?.id);
      console.log(`index: ${index}`);
      console.log(`group: ${JSON.stringify(action.group)}`)
      if(index < 0) return state;
      state.groups[index] = action.group;
      console.log(`groups: ${JSON.stringify(state.groups)}`)
      setUserData({
        ...state,
        groups: [...state.groups],
      });
      return {
        ...state,
        groups: [...state.groups],
      };
    }
    case "DELETE_GROUP": {
      console.debug("DELETE_GROUP");
      if (action.id === undefined) {
        console.error("Operation DELETE_GROUP requires {id} attribute");
        return state;
      }
      const index = state.groups.findIndex((group) => group.id === action.id);
      let newGroups = [...state.groups];
      if (index >= 0) {
        // Remove group from index
        newGroups.splice(index, 1);
      } else {
        console.warn(
          `Cant remove group (id: ${action.id}) as it does not exist.`
        );
      }

      setUserData({
        ...state,
        groups: newGroups,
        skills: state.skills.filter(skill => skill.group.id !== action.id)
      });
      return {
        ...state,
        groups: newGroups,
        skills: state.skills.filter(skill => skill.group.id !== action.id)
      };
    }
    case "DROP_GROUP": {
      // Change the positon of group tab (dnd-kit sortable)
      console.debug("DROP_GROUP");
      if (action.active === undefined || action.over === undefined) {
        console.error(
          "Operation DROP_GROUP requires {active, over} attributes"
        );
        return state;
      }
      let activeIndex = state.groups.findIndex(
        (group) => group.id === action.active?.id
      );
      let overIndex = state.groups.findIndex(
        (group) => group.id === action.over?.id
      );
      let newGroups = arrayMove(state.groups, activeIndex, overIndex);
      setUserData({
        ...state,
        groups: newGroups,
      });
      return {
        ...state,
        groups: newGroups,
      };
    }
    // ACTIONS
    case "SET_ACTION": {
      console.debug("SET_ACTION");
      if (action.action === undefined) {
        console.error("Operation SET_ACTION requires {action} attributes");
        return state;
      }
      // Set an existing skill
      let newActions = [...state.actions];
      let index = newActions.findIndex((target) => target.id === action.action.id);
      if(index < 0) {
        console.error("Can't find action")
        return state;
      }
      newActions[index] = action.action;
      setUserData({
        ...state,
        actions: [...newActions],
      });
      return {
        ...state,
        actions: [...newActions],
      };
    }
    case "ADD_ACTION": {
      console.debug("ADD_ACTION");
      let newAction: Action = {
        id: action.id ? action.id : uuid(),
        title: action.name ? action.name : "Untitled",
        description: "",
        actionSkills: [],
      }
      setUserData({
        ...state,
        actions: [...state.actions, newAction],
      });
      return {
        ...state,
        actions: [...state.actions, newAction],
      };
    }
    case "ADD_ACTION_SKILL": {
      console.debug("ADD_ACTION_SKILL");
      if (action.id === undefined || action.skill === undefined) {
        console.error(
          "Operation ADD_ACTION_SKILL requires {id, skill} attributes"
        );
        return state;
      }
      const index = state.actions.findIndex(a => a.id === action.id)
      const target = JSON.parse(JSON.stringify(state.actions[index]));
      if (!target) {
        console.error(
          "Skill action id not found"
        );
        return state;
      }
      const newActionSkill: ActionSkill = {
        skill: action.skill,
        levelChange: '0',
      }
      target.actionSkills = [...target?.actionSkills, newActionSkill];
      let newActions = [...state.actions];
      newActions[index] = target;
      setUserData({
        ...state,
        actions: newActions,
      });
      return {
        ...state,
        actions: newActions,
      };
    }
    default: {
      console.debug(`Unknown action type: ${action.type}`);
      return state;
    }
  }
};

export default reducer;
