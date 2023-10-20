import "./ActionContent.css";
import React from 'react';
import { HiOutlinePlus } from "react-icons/hi";
import { ActionButton, ActionForm } from "./components";
import { useMain } from "StateProvider";

export const ActionContent = () => {
  const [{activeAction}, ] = useMain();

  return (
    <div className="layout_row">
      <div className="action_preview">
        <ActionForm action={activeAction} />
      </div>
      <div className="action_group">
        Actions
        <ActionButton title="Action 1" />
        <button className="action_button">
          <HiOutlinePlus className="icon" size={14} />
          New Group
        </button>
      </div>
      <div className="action_group">
        Log
        <button className="action_button">
          Action 1
        </button>
      </div>
    </div>
  )
}