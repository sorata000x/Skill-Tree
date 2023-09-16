import "./MoreButton.css";
import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Group } from "types";
import { MoreMenu } from "./components";

export interface Props {
  group: Group;
  editGroupName: Function;
}

/**
 * More button, click to open more menu
 * - MoreMenu | menu that contains action buttons to operate on current group
 */
export const MoreButton = ({ group, editGroupName }: Props) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // set MoreMenu position near clicked position
    setMenuPos({ top: e.clientY + 20, left: e.clientX });
    setMoreMenuOpen(true);
  };

  return (
    <>
      <button className="more_button" title="more">
        <FiMoreHorizontal
          className="more_button"
          size={21}
          onClick={(e) => handleClick(e)}
        />
      </button>
      <MoreMenu
        open={moreMenuOpen}
        close={() => setMoreMenuOpen(false)}
        group={group}
        style={{ ...menuPos }}
        editGroupName={editGroupName}
      />
    </>
  );
};
