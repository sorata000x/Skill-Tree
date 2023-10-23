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
export const UserContext = createContext();

// An wrapping function to handle thunks (dispatched actions which are wrapped in a function, needed for async callbacks)
const asyncer = (dispatch: any, state: StateData) => (action: any) =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

export interface Props {
  children: any;
}

// Wrap the app and provide the data layer
export const UserProvider = ({ children }: Props) => {
  const [state, dispatchBase] = useReducer(reducer, initialState);

  const dispatch = useCallback(asyncer(dispatchBase, state), []);

  return (
    // @ts-ignore
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

// Pull information from the data layer
export const useUser = (): [StateData, Function] => {
  // @ts-ignore
  const [state, dispatch] = useContext(UserContext);
  if (state) return [state, dispatch];
  else return [initialState, dispatch];
};
