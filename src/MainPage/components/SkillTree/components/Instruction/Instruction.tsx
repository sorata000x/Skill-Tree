import { useStateValue } from "StateProvider";
import React, { useEffect } from "react";
import { Group, Skill } from "types";
import "./Instruction.css"

export interface Props {
  group: Group | null,
  skills: Array<Skill>,
  handleDoubleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export const Instruction = ({group, skills, handleDoubleClick}: Props) => {
  const [{groups}, ] = useStateValue();

  return (
    <div className="instruction" onDoubleClick={handleDoubleClick}>
      {!groups.length && "Create A Group To Start"}
      {(group && !skills.length) && "Double Click To Create A Skill"}
    </div>
  )
}