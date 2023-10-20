import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type { StateData } from "./reducer";
import reducer, { initialState } from "./reducer";

// Prepare the data layer
// Reference: [StackOverflow] createContext doesn't accept defaultValue | https://stackoverflow.com/questions/63193891/createcontext-doesnt-accept-defaultvalue
// @ts-ignore
export const MainContext = createContext();

// An wrapping function to handle thunks (dispatched actions which are wrapped in a function, needed for async callbacks)
const asyncer = (dispatch: any, state: StateData) => (action: any) =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

export interface Props {
  children: any;
}

// Wrap the app and provide the data layer
export const MainProvider = ({ children }: Props) => {
  const [state, dispatchBase] = useReducer(reducer, initialState);

  const dispatch = useCallback(asyncer(dispatchBase, state), []);

  return (
    // @ts-ignore
    <MainContext.Provider value={[state, dispatch]}>
      {children}
    </MainContext.Provider>
  );
};

// Pull information from the data layer
export const useMain = (): [StateData, Function] => {
  // @ts-ignore
  const [state, dispatch] = useContext(MainContext);
  if (state) return [state, dispatch];
  else return [initialState, dispatch];
};
