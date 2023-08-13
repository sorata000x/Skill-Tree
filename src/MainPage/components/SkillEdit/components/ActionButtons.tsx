import { useStateValue } from "StateProvider";
import React from "react";
import { CgClose } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";

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
    <div className="action_container">
      <CgClose className="action_btn" size={20} onClick={()=>close()} />
      <FaRegTrashAlt className="action_btn" size={18} onClick={()=>deleteSkill()} />
    </div>
  )
}