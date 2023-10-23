import React from "react";
import type { Group } from "types";
import { useUser, useMain } from "StateProvider";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { HiOutlinePlus } from "react-icons/hi";
import "./NewGroupButton.css";

export interface Props {
  groups: Array<Group>;
}

/**
 * Button to create a new group tab
 */
export const NewGroupButton = ({ groups }: Props) => {
  const [, dispatchUser] = useUser();
  const [, dispatchMain] = useMain();
  const navigate = useNavigate();

  const addNewGroup = () => {
    let newGroup = {
      id: uuid(),
      name: `Group ${groups.length + 1}`,
      zoom: 1,
    };
    dispatchUser({
      type: "ADD_NEW_GROUP",
      group: newGroup,
    });
    dispatchMain({
      type: "SET_ACTIVE_GROUP",
      id: newGroup.id,
    });
    navigate(`/${newGroup.id}`);
  };

  return (
    <button className="new_group_button" onClick={() => addNewGroup()}>
      <HiOutlinePlus className="icon" size={14} />
      New Group
    </button>
  );
};
