import { User } from "firebase/auth";

export interface Icon {
  name: string;
  url: string;
  scale: number;
}

export interface Skill {
  id: string;
  parent: string;
  title: string;
  level: number;
  maxLevel: number;
  increaseBy: number;
  icon?: Icon;
  description: string;
  group: Group;
  treeOpen: boolean;
}

export interface Group {
  id: string;
  name: string;
  zoom: number;
}

export interface Buttons {
  [key: string]: React.RefObject<HTMLButtonElement>;
}

export interface DragOverlay {
  skills: Array<Skill>;
  buttons: Buttons;
  parentId: string;
}

export interface ActionSkill {
  skill: Skill;
  levelChange: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  actionSkills: Array<ActionSkill>;
}

export interface Links {
  [key: string]: React.ReactElement<any, any>;
}
