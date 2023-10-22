import { useUser } from "StateProvider";
import "./AddActionButton.css";
import React from "react";
import { HiOutlinePlus } from "react-icons/hi";

export const AddActionButton = () => {
  const [{actions}, dispatch] = useUser();

  const handleClick = (e: React.MouseEvent) => {
    dispatch({
      type: "ADD_ACTION"
    })
  }

  return (
    <button className="action_button" onClick={e=>handleClick(e)}>
      <HiOutlinePlus className="icon" size={14} />
      New Group
    </button>
  )
}