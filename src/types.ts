import { User } from "firebase/auth";

export interface Skill {
  id: string;
  parent: string;
  title: string;
  level: number;
  maxLevel: number;
  increaseBy: number;
  image: string;
  description: string;
  group: Group;
  treeOpen: boolean;
}

export interface Group {
  id: string;
  name: string;
}

export interface Buttons {
  [key: string]: React.RefObject<HTMLButtonElement>;
}

export interface PopUp {
  type: string;
  // type: more_pop_up
  group?: Group;
  editGroupName?: Function;
  top?: number;
  left?: number;
}

export interface DragOverlay {
  skills: Array<Skill>;
  buttons: Buttons;
  parentId: string;
}

export interface Data {
  skills: Array<Skill>;
  activeSkill: Skill | null;
  buttons: Buttons;
  groups: Array<Group>;
  activeGroup: Group | null;
  popUp: PopUp | null;
  user: User | null;
  dragOverlay: DragOverlay;
  theme: string;
}

export interface Links {
  [key: string]: React.ReactElement<any, any>;
}

export interface Action {
  type: string;
  id?: string;
  skill?: Skill;
  skills?: Array<Skill>;
  activeSkill?: Skill;
  parentID?: string;
  group?: Group;
  active?: Skill;
  over?: Skill;
  groups?: Array<Group>;
  name?: string;
  popUp?: PopUp;
  user?: User;
  dragOverlay?: DragOverlay;
  theme?: string;
  treeOpen?: boolean;
}
