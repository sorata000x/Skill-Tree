import { useStateValue } from "StateProvider";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Skill } from "types";
import "./SkillProgress.css";

export interface Props {
  id: string;
  level: number;
  maxLevel: number;
}

export const SkillProgress = ({ id, level, maxLevel }: Props) => {
  const [{ activeSkill }, dispatch] = useStateValue();

  return (
    <div
      className={"skill_progress" + (activeSkill?.id === id ? " active" : "")}
    >
      {/* Example: Base react-circular-progressbar examples | https://codesandbox.io/s/vymm4oln6y?file=/index.js:6428-6517 */}
      <CircularProgressbar
        value={(level / maxLevel) * 100}
        strokeWidth={50}
        className="circular-progressbar"
        styles={buildStyles({
          strokeLinecap: "butt",
          trailColor: 'transparent',
          pathColor: '#4e6374',
        })}
      />
    </div>
  );
};
