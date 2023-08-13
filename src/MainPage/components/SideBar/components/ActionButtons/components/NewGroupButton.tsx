import React from "react";
import type { Group } from "types";
import { useStateValue } from "StateProvider";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { HiOutlinePlus } from "react-icons/hi";

export interface Props {
  groups: Array<Group>,
}

export const NewGroupButton = ({groups}: Props) => {
  const [{}, dispatch] = useStateValue();
  const navigate = useNavigate();

  const addNewGroup = () => {
    let newGroup = {
      id: uuid(),
      name: `Group ${groups.length + 1}`,
    };
    dispatch({
      type: "ADD_NEW_GROUP",
      group: newGroup,
    });
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: newGroup.id,
    });
    navigate(`/${newGroup.id}`);
  };

  return (
    <button
      title="add new group" 
      className="new_group_button" 
      onClick={addNewGroup}
      >
      <HiOutlinePlus className="new_group_add_icon" size={14} />
      New Group
    </button>
  );
}