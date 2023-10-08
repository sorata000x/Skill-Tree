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

export interface PopUp {
  type: string;
  focus?: boolean;
  // type: more_pop_up
  morePopUpData: {
    group: Group;
    pos: {
      top: number;
      left: number;
    };
    editGroupName: Function;
  };
  group?: Group;
  editGroupName?: Function;
  top?: number;
  left?: number;
  // type: image_edit
  icon?: Icon;
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
  popUp: any;
  user: User | null;
  dragOverlay: DragOverlay | null;
  theme: string;
  sideBarOpen: boolean,
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
  isDraggingOver?: boolean;
  sideBarOpen?: boolean;
}
