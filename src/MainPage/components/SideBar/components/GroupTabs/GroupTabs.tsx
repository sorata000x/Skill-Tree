import React from "react";
import { GroupTab } from "./components";
import { useStateValue } from "StateProvider";
import { Group } from "types";

export const GroupTabs = () => {
  const [{ groups }] = useStateValue();

  return (
    <div className="group_tabs_container">
      {groups?.map((group: Group) => (
        <GroupTab group={group} />
      ))}
    </div>
  )
}