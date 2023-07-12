import {createRef} from 'react';
import { v4 as uuid} from "uuid";

export const INITIAL_SKILL = [
  {
    id: uuid(),
    title: "Skill 1",
    level: "0",
    children: [],
    ref: createRef(),
  },
  {
    id: uuid(),
    title: "Skill 2",
    level: "10",
    children: [],
    ref: createRef(),
  },
  {
    id: uuid(),
    title: "Skill 3",
    level: "50",
    children: [],
    ref: createRef(),
  }
]