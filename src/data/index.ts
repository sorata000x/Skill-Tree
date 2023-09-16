import type { Data, Skill, Group } from "types";

export const emptyState: Data = {
  skills: [],
  activeSkill: null,
  buttons: {},
  groups: [],
  activeGroup: null,
  popUp: null,
  user: null,
  dragOverlay: {
    skills: [],
    buttons: {},
    parentId: "root",
  },
  theme: "light",
};

export const emptyGroup: Group = {
  id: "",
  name: "",
};

export const emptySkill: Skill = {
  id: "",
  parent: "root",
  title: "",
  level: 0,
  maxLevel: 10,
  increaseBy: 1,
  description: "",
  group: emptyGroup,
  treeOpen: true,
};
