import { useMain } from "StateProvider";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ActionButton = () => {
  const [, dispatch] = useMain();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: "",
    });
    navigate(`/action`); // set url to current group id
  };

  return (
    <button className="tab" onClick={(e)=>handleClick(e)}>
      Action
    </button>
  )
}