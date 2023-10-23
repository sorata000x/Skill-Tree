import "./ActionContent.css";
import React from 'react';
import { HiOutlinePlus } from "react-icons/hi";
import { ActionTab, ActionForm, AddActionButton } from "./components";
import { useMain, useUser } from "StateProvider";

export const ActionContent = () => {
  const [{actions}, ] = useUser();
  const [{activeAction}, ] = useMain();

  return (
    <div className="layout_row">
      <div className="action_preview">
        <ActionForm action={activeAction} />
      </div>
      <div className="action_group">
        Actions
        {actions.map(action => <ActionTab 
                                action={action}
                                active={activeAction?.id === action.id}
                                />)}
        <AddActionButton />
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