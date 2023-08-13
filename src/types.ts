import { User } from "firebase/auth";

export interface Skill {
  id: string,
  parent: string,
  children: Array<Skill>,
  title: string,
  level: number,
  maxLevel: number,
  increaseBy: number,
  image: string,
  description: string,
  group: Group,
}

export interface Group {
  id: string,
  name: string,
}

export interface Buttons { 
  [key: string]: React.RefObject<HTMLButtonElement> 
}

export interface Data {
  skills: Array<Skill>,
  activeSkill: Skill | null,
  buttons: Buttons,
  groups: Array<Group>,
  activeGroup: Group | null,
  user: User | null,
}

export interface Links {
  [key: string]: React.ReactElement<any, any>,
}