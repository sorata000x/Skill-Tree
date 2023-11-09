import { useUser } from "StateProvider";
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
    <button className="btn btn-primary" onClick={e=>handleClick(e)}>
      <HiOutlinePlus className="m-1" size={14} />
      New Group
    </button>
  )
}