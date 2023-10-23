import { StateData } from "./reducer";

export const emptyData: StateData = {
  user: null,
  theme: 'light',
  skills: [],
  groups: [],
  actions: [],
};

export const emptyGroup = {
  id: "",
  name: "",
  zoom: 1,
};

export const emptySkill = {
  id: "",
  parent: "",
  title: "",
  level: 0,
  maxLevel: 0,
  increaseBy: 1,
  description: "",
  group: emptyGroup,
  treeOpen: true,
};