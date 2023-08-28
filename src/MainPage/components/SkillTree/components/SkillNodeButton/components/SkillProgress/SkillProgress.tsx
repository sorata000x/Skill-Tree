import { useStateValue } from "StateProvider";
import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "./SkillProgress.css";
import { RadialSeparators } from "./components";

export interface Props {
  id: string;
  level: number;
  maxLevel: number;
}

export const SkillProgress = ({ id, level, maxLevel }: Props) => {
  const [{ activeSkill }, ] = useStateValue();

  return ( maxLevel ?
    <div
      className={"skill_progress" + (activeSkill?.id === id ? " active" : "")}
    >
      {/* Example: Base react-circular-progressbar examples | https://codesandbox.io/s/vymm4oln6y?file=/index.js:6428-6517 */}
      <CircularProgressbarWithChildren
        value={maxLevel ? (level / maxLevel) * 100 : 0}
        strokeWidth={50}
        className="circular-progressbar"
        styles={buildStyles({
          strokeLinecap: "butt",
          trailColor: maxLevel ? "#404040" : "transparent",
          pathColor: "#446682",
        })}
      >
        <RadialSeparators
          count={maxLevel}
        />
      </CircularProgressbarWithChildren>
    </div> : null
  );
};
