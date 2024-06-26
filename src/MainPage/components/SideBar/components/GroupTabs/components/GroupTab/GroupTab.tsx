import React, { useState } from "react";
import type { Group } from "types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMain, useUser } from "StateProvider";
import { GroupNameInput, MoreButton } from "./components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface Props {
  group: Group;
}

/**
 * Tab button to navigate to different tree group
 * - GroupNameInput | input for group name
 * - MoreButton | button to open MoreMenu
 */
export const GroupTab = ({ group }: Props) => {
  const [, dispatch] = useMain();
  const [{groups}, ] = useUser();
  const navigate = useNavigate();
  const urlParam = useParams().pathParam;
  const [editing, setEditing] = useState(false);

  // Set url parameter to current group id
  const setActiveGroup = () => {
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: group.id,
      groups: groups,
    });
    navigate(`/${group.id}`);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/${group.id}`); // set url to current group id
    setActiveGroup();
  };

  /* Dnd-kit DragOverlay */

  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <button
      className={"tab" + (urlParam === group.id ? " active" : "")}
      onClick={(e) => handleClick(e)}
      // Dnd-kit DragOverlay
      ref={setNodeRef}
      style={style}
      {...listeners}
    >
      {!editing ? (
        <div style={{width: "232px", overflow: "hidden"}}>{group.name}</div>
      ) : (
        <GroupNameInput group={group} setEditing={setEditing} />
      )}
      <MoreButton group={group} editGroupName={() => setEditing(true)} />
    </button>
  );
};
