import { useStateValue } from 'StateProvider';
import React from 'react';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Skill } from 'types';

export interface Props {
  skill: Skill,
}

export const SkillProgress = ({skill}: Props) => {

  const [{activeSkill}, dispatch] = useStateValue();

  return (
    <div
      className={
        "skill_progress_container" +
        (activeSkill?.id === skill.id ? " active" : "")
      }
    >
      {/* Example: Base react-circular-progressbar examples | https://codesandbox.io/s/vymm4oln6y?file=/index.js:6428-6517 */}
      <CircularProgressbar
        value={(skill.level / skill.maxLevel) * 100}
        strokeWidth={50}
        className="circular-progressbar"
        styles={buildStyles({
          strokeLinecap: "butt",
        })}
      />
    </div>
  )
}

