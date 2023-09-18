import React from "react";
import { Skill } from "types";
import "./Message.css";

export interface Props {
  skills: Array<Skill>;
}

/**
 * Background text message when there is no skills to display
 */
export const Message = ({ skills }: Props) => {
  return (
    <div className="instruction">
      {!skills.length && "This Skill Tree is Empty"}
    </div>
  );
};
