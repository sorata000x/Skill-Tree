import type { Skill, Buttons, Group, DragOverlay } from "types";

// For get user data, see App.tsx

export interface StateData {
  buttons: Buttons;
  dragOverlay: DragOverlay | null;
}

export interface StateAction {
  type: string;
  buttons: Buttons;
  dragOverlay: DragOverlay | null;
}

// Get initial state from local storage or set to empty
const getInitialState = (): StateData => {
  return {
    buttons: {},
    dragOverlay: null,
  }
};

export const initialState: StateData = getInitialState();

const reducer = (state: StateData, action: StateAction): StateData => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default reducer;
