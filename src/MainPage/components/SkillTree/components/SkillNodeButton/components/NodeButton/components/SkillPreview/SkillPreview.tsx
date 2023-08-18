import "./SkillPreview.css";
import React, { useEffect, useState } from "react";
import type { Skill } from "types";

export interface Props {
  open: boolean;
  skill: Skill;
}

export const SkillPreview = ({ open, skill }: Props) => {
  return open ? (
    <div
      className="skill_preview fade-in"
      onMouseOver={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
    >
      <p>Title: {skill.title}</p>
      <p>
        Level: {skill.level} / {skill.maxLevel}
      </p>
      <p>
        Description: <br /> {skill.description}
      </p>
    </div>
  ) : null;
};
