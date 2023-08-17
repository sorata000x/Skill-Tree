import React, { useState } from "react";
import type { Group } from "types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "StateProvider";
import { BiSolidEditAlt } from "react-icons/bi"
import { GroupNameInput } from "./components";
import "./GroupTab.css"

export interface Props {
  group: Group,
}

export const GroupTab = ({group}: Props) => {
  const [{activeGroup}, dispatch] = useStateValue();
  const navigate = useNavigate();
  const urlParam = useParams().pathParam;
  const [hovering, setHovering] = useState(false);   // is hovering on the group tab
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
    navigate(`/${group.id}`);   // set url with current group id
    setActiveGroup();
  }

  return (
    <button
      className="group_tab"
      style={urlParam === group.id ? {backgroundColor: 'rgb(220, 220, 220)'} : {}}
      onClick={(e) => handleClick(e)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)} 
    >
      { !editing ?
        group.name :
        <GroupNameInput 
          group={group}
          setEditing={setEditing}
        />
      }
      { hovering && !editing &&
        <BiSolidEditAlt
          className="edit_button"
          size={21}
          onClick={()=>setEditing(true)}/> 
      }
    </button>
  )
}