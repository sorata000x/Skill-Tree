import React, { createRef, useEffect, useState } from "react";
import type { Group } from "types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "StateProvider";
import { BiSolidEditAlt } from "react-icons/bi";
import { GroupNameInput, MoreButton } from "./components";
import "./GroupTab.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export interface Props {
  group: Group;
}

export const GroupTab = ({ group }: Props) => {
  const [, dispatch] = useStateValue();
  const navigate = useNavigate();
  const urlParam = useParams().pathParam;
  const [hovering, setHovering] = useState(false); // is hovering on the group tab
  const [editing, setEditing] = useState(false);

  // Set url parameter as current group id
  const setActiveGroup = () => {
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: group.id,
    });
    navigate(`/${group.id}`);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/${group.id}`); // set url with current group id
    setActiveGroup();
  };

  const handleClickMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "SET_POP_UP",
      popUp: {
        type: "more_menu",
        group: group,
        editGroupName: ()=>setEditing(true),
        top: e.clientY,
        left: e.clientX,
      },
    });
  };

  /* Dnd-kit DragOverlay */

  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: group.id, });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <button
      className={"group_tab" + (urlParam === group.id ? " active" : "")}
      onClick={(e) => handleClick(e)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      // Dnd-kit DragOverlay
      ref={setNodeRef}
      style={style}
      {...listeners}
    >
      {!editing ? (
        group.name
      ) : (
        <GroupNameInput group={group} setEditing={setEditing} />
      )}
      <MoreButton open={hovering && !editing} group={group} handleClick={handleClickMore}/>
    </button>
  );
};
