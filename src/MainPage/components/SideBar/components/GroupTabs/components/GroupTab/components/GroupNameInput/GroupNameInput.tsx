import React from "react";
import { useUser } from "StateProvider";
import { Group } from "types";

export interface Props {
  group: Group;
  setEditing: Function;
}

/**
 * Group name input field for editing group name
 */
export const GroupNameInput = ({ group, setEditing }: Props) => {
  const [, dispatch] = useUser();

  // Set group name of given id
  const setGroupName = (id: string, name: string) => {
    dispatch({
      type: "SET_GROUP_NAME",
      id: id,
      name: name,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      setEditing(false);
    }
  };

  return (
    <input
      title="group name input"
      autoFocus
      value={group.name}
      onChange={(e) => setGroupName(group.id, e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => handleKeyDown(e)}
    />
  );
};
