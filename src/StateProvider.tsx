import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from "react";
import type { Data, Action } from "types";
import reducer, { initialState } from "./reducer";

// Prepare the data layer
// Reference: [StackOverflow] createContext doesn't accept defaultValue | https://stackoverflow.com/questions/63193891/createcontext-doesnt-accept-defaultvalue
// @ts-ignore
export const StateContext = createContext();

// An wrapping function to handle thunks (dispatched actions which are wrapped in a function, needed for async callbacks)
const asyncer = (dispatch: any, state: Data) => (action: any) =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

export interface Props {
  children: any;
}

// Wrap the app and provide the data layer
export const StateProvider = ({ children }: Props) => {
  const [state, dispatchBase] = useReducer(reducer, initialState);

  const dispatch = useCallback(asyncer(dispatchBase, state), []);

  return (
    // @ts-ignore
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

// Pull information from the data layer
export const useStateValue = (): [Data, Function] => {
  // @ts-ignore
  const [state, dispatch] = useContext(StateContext);
  if (state) return [state, dispatch];
  else return [initialState, dispatch];
};
