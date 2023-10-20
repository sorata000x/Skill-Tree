import { Skill, Group, Action } from "types";
// For get user data, see App.tsx

export interface StateData {
  popUp: any,
  activeSkill: Skill | null;
  activeGroup: Group | null;
  activeAction: Action | null;
}

export interface StateAction {
  type: string,
  popUp: any,
  activeSkill: Skill | null;
  id: string,
  groups: Array<Group>;
  actions: Array<Action>;
}

// Get initial state from local storage or set to empty
const getInitialState = (): StateData => {
  return {
    popUp: null,
    activeSkill: null,
    activeGroup: null,
    activeAction: null,
  }
};

export const initialState: StateData = getInitialState();

const reducer = (state: StateData, action: StateAction): StateData => {
  switch (action.type) {
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
    // ACTIVE GROUP
    case "SET_ACTIVE_GROUP": {
      console.debug("SET_ACTIVE_GROUP");
      if (action.id === undefined || action.groups === undefined) {
        console.error("Operation SET_ACTIVE_GROUP requires {id, group} attribute");
        return state;
      }
      const index = action.groups.findIndex((group) => group.id === action.id);
      return {
        ...state,
        activeGroup: index >= 0 ? action.groups[index] : null,
      };
    }
    // ACTIVE ACTION
    case "SET_ACTIVE_ACTION": {
      console.debug("SET_ACTIVE_ACTION");
      if (action.id === undefined || action.actions === undefined) {
        console.error("Operation SET_ACTIVE_ACTION requires {id, actions} attribute");
        return state;
      }
      const index = action.actions.findIndex((target: Action) => target.id === action.id);
      return {
        ...state,
        activeAction: index >= 0 ? action.actions[index] : null,
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
    default:
      return state;
  }
};

export default reducer;
