import type { Data, Skill, Group } from "types";
import { v4 as uuid } from "uuid";

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
  sideBarOpen: true,
};

export const emptyGroup: Group = {
  id: uuid(),
  name: "Untitled",
  zoom: 1,
};

export const emptySkill: Skill = {
  id: uuid(),
  parent: "root",
  title: "",
  level: 0,
  maxLevel: 10,
  increaseBy: 1,
  description: "",
  group: emptyGroup,
  treeOpen: true,
};

