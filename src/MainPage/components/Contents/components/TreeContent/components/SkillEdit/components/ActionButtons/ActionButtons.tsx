import { useMain, useUser } from "StateProvider";
import React from "react";
import { CgClose } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ActionButtons.css";

/**
 * Action button group including:
 * - Close button | click to close skill edit window
 * - Delete button | click to delete current (active) skill
 */
export const ActionButtons = () => {
  const [{ activeSkill }, dispatchMain] = useMain();
  const [, dispatchUser] = useUser();

  const close = () => {
    dispatchMain({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const deleteSkill = () => {
    if (activeSkill) {
      dispatchUser({
        type: "DELETE_SKILL",
        id: activeSkill.id,
      });
    }
    close();
  };

  return (
    <div className="action_buttons">
      <button title="close">
        <CgClose className="button" size={20} onClick={() => close()} />
      </button>
      <button title="delete skill">
        <FaRegTrashAlt
          className="button"
          size={18}
          onClick={() => deleteSkill()}
        />
      </button>
    </div>
  );
};
