import React from 'react';
import { ActionTab, ActionLogTab, ActionForm, AddActionButton } from "./components";
import { useMain, useUser } from "StateProvider";

export const ActionContent = () => {
  const [{actions, actionLogs}, ] = useUser();
  const [{activeAction}, ] = useMain();

  return (
    <div className="d-flex w-100 h-100 p-3 gap-5 justify-content-end">
      <div className="bg-secondary">
        <ActionForm action={activeAction} />
      </div>
      <div className="d-flex flex-column overflow-scroll w-25">
        <label className="m-1">Actions</label>
        {actions.map(action => <ActionTab 
                                action={action}
                                active={activeAction?.id === action.id}
                                />)}
        <AddActionButton />
      </div>
      <div className="d-flex flex-column overflow-scroll w-25">
      <label className="m-1">History</label>
        {actionLogs.map(actionLog => <ActionLogTab 
                                      actionLog={actionLog}
                                      />)}
      </div>
    </div>
  )
}