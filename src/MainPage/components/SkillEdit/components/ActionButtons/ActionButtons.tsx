import { useStateValue } from "StateProvider";
import React from "react";
import { CgClose } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ActionButtons.css";

export const ActionButtons = () => {
  const [{activeSkill}, dispatch] = useStateValue();

  const close = () => {
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const deleteSkill = () => {
    if (activeSkill) {
      dispatch({
        type: "DELETE_SKILL",
        id: activeSkill.id,
      });
    }
    close();
  };

  return (
    <div className="action_buttons">
      <CgClose className="button" size={20} onClick={()=>close()} />
      <FaRegTrashAlt className="button" size={18} onClick={()=>deleteSkill()} />
    </div>
  )
}