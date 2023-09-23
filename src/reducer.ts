import { db, auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { createRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";
import type { Data, Skill, Buttons, Action } from "types";
import { emptyState, emptySkill } from "data";
import { useNavigate } from "react-router-dom";
import { emptyGroup } from "data";

// For get user data, see App.tsx

// Send current data to local storage / firebase
const setUserData = async (data: Data) => {
  if (!auth.currentUser) {
    localStorage.setItem("skills", JSON.stringify(data.skills));
    localStorage.setItem("groups", JSON.stringify(data.groups));
    localStorage.setItem("theme", data.theme);
  } else {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      skills: JSON.stringify(data.skills),
      groups: JSON.stringify(data.groups),
      theme: data.theme,
    });
  }
};

// Get initial state from local storage or set to empty
const getInitialState = (): Data => {
  // Get data from local storage if data exist
  // Reference: [StackOverflow] Argument of type 'string | null' is not assignable to parameter of type 'string'. Type 'null' is not assignable to type 'string' | https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
  const skills: Array<Skill> = JSON.parse(
    localStorage.getItem("skills") || "[]"
  )
    ? JSON.parse(localStorage.getItem("skills") || "[]")
    : [];
  const buttons: Buttons = {};
  for (const skill of skills) {
    buttons[skill.id] = createRef();
  }
  const groups = JSON.parse(localStorage.getItem("groups") || "[]")
    ? JSON.parse(localStorage.getItem("groups") || "[]")
    : [];
  const theme: string = localStorage.getItem("theme") || "light";
  return {
    skills: skills,
    activeSkill: null,
    buttons: buttons,
    groups: groups,
    activeGroup: groups.length ? groups[0] : null,
    popUp: null,
    user: null,
    dragOverlay: {
      skills: [],
      buttons: {},
      parentId: "root",
    },
    theme: theme,
  };
};

export const initialState: Data = getInitialState();

const reducer = (state: Data, action: Action): Data => {
  switch (action.type) {
    // SKILLS
    case "SET_SKILLS": {
      console.debug("SET_SKILLS");
      if (action.skills === undefined) {
        console.error("Operation SET_SKILLS requires {skills} attribute");
        return state;
      }
      console.debug(`SET SKILLS TO {${action.skills}}`);
      // relace all the skills with a new set of skills
      let newSkills = action.skills;
      for (let i = 0; i < newSkills.length; i++) {
        newSkills[i] = {
          ...emptySkill, // pre-define all properties (data patch)
          ...newSkills[i],
        };
        state.buttons[newSkills[i].id] = createRef();
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
      // Change the positon of skill node (dnd-kit sortable)
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
        buttons: {},
      });
      return {
        ...state,
        skills: [],
        buttons: {},
      };
    }
    case "SET_ACTIVE_SKILL": {
      console.debug("SET_ACTIVE_SKILL");
      if (action.activeSkill === undefined) {
        console.error(
          "Operation SET_ACTIVE_SKILL requires {activeSkill} attribute"
        );
        return state;
      }
      return {
        ...state,
        activeSkill: action.activeSkill,
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
    // DRAG_OVERLAY
    case "SET_DRAG_OVERLAY": {
      console.debug("SET_DRAG_OVERLAY");
      if (action.dragOverlay === undefined) {
        console.error(
          "Operation SET_DRAG_OVERLAY requires {dragOverlay} attribute"
        );
        return state;
      }
      return {
        ...state,
        dragOverlay: action.dragOverlay,
      };
    }
    case "REMOVE_DRAG_OVERLAY": {
      console.debug("REMOVE_DRAG_OVERLAY");
      return {
        ...state,
        dragOverlay: null,
      }
    }
    // GROUP
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
    case "SET_ACTIVE_GROUP": {
      console.debug("SET_ACTIVE_GROUP");
      if (action.id === undefined) {
        console.error("Operation SET_ACTIVE_GROUP requires {id} attribute");
        return state;
      }
      const index = state.groups.findIndex((group) => group.id === action.id);
      setUserData({
        ...state,
        activeGroup: index >= 0 ? state.groups[index] : null,
      });
      return {
        ...state,
        activeGroup: index >= 0 ? state.groups[index] : null,
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
      });
      return {
        ...state,
        groups: newGroups,
        activeGroup: newGroups[0],
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
    // POP UPS
    case "SET_POP_UP": {
      console.debug("SET_POP_UP");
      if (action.popUp === undefined) {
        console.error("Operation SET_POP_UP requires {popUp} attribute");
        return state;
      }
      return {
        ...state,
        popUp: action.popUp,
      };
    }
    case "CLOSE_POP_UP": {
      console.debug("CLOSE_POP_UP");
      return {
        ...state,
        popUp: null,
      };
    }
    // AUTHENTICATION
    case "SIGN_OUT": {
      console.debug("SIGN_OUT");
      return {
        ...emptyState,
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
    default:
      return state;
  }
};

export default reducer;
