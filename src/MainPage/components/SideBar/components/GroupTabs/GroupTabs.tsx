import React from "react";
import { GroupTab } from "./components";
import { useStateValue } from "StateProvider";
import { Group } from "types";
import "./GroupTabs.css";

export const GroupTabs = () => {
  const [{groups}, ] = useStateValue();

  return (
    <div className="group_tabs">
      {groups?.map((group: Group) => (
        <GroupTab group={group} />
      ))}
    </div>
  )
}