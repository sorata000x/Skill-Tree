import React from "react";
import type { Group } from "types";
import { useUser, useMain } from "StateProvider";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { HiOutlinePlus } from "react-icons/hi";

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
  };

  return (
    <button 
      className="btn btn-primary text-start m-2" 
      onClick={() => addNewGroup()}
      style={{height: "56px"}}
      >
      <HiOutlinePlus className="m-1" size={14} />
      New Group
    </button>
  );
};
