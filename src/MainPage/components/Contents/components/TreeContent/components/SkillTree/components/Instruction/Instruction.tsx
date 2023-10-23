import { useUser } from "StateProvider";
import React from "react";
import { Group } from "types";
import "./Instruction.css";

export interface Props {
  group: Group | null;
}

/**
 * Background text to prompt user to add a group or skill
 */
export const Instruction = ({ group }: Props) => {
  const [{ groups }] = useUser();

  return (
    <div className="instruction">
      {!groups.length && "Create A Group To Start"}
    </div>
  );
};
