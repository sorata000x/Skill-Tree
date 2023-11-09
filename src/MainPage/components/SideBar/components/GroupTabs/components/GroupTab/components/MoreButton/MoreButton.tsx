import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Group } from "types";
import { MoreMenu } from "./components";
import { useMain } from "StateProvider";

export interface Props {
  group: Group;
  editGroupName: Function;
}

/**
 * More button, click to open more menu
 * - MoreMenu | menu that contains action buttons to operate on current group
 */
export const MoreButton = ({ group, editGroupName }: Props) => {
  const [{}, dispatchMain] = useMain();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // set MoreMenu position near clicked position
    dispatchMain({
      type: "SET_POP_UP",
      popUp: <MoreMenu
                group={group}
                style={{ top: e.clientY + 20, left: e.clientX }}
                editGroupName={editGroupName}
             />
    })
  };

  return (
    <button className="btn icon-btn" title="more">
      <FiMoreHorizontal
        size={21}
        onClick={(e) => handleClick(e)}
      />
    </button>
  );
};
