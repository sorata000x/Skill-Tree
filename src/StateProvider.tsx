import React, { createContext, useContext, useReducer } from "react";
import type { Data } from 'types';

const emptyState: Data = {
  skills: [],
  activeSkill: null,
  buttons: {},
  groups: [],
  activeGroup: null,
  user: null,
};

// Prepare the data layer
// Reference: [StackOverflow] createContext doesn't accept defaultValue | https://stackoverflow.com/questions/63193891/createcontext-doesnt-accept-defaultvalue
export const StateContext = createContext<[Data, React.Dispatch<any>]>(
  [emptyState, () => null]);

export interface Props {
  reducer: any,
  initialState: any,
  children: any,
}

// Wrap the app and provide the data layer
export const StateProvider = ({ 
  reducer, 
  initialState, 
  children }
: Props) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Pull information from the data layer
export const useStateValue = () => useContext(StateContext);
