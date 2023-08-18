import React from "react";
import { useStateValue } from "StateProvider";
import { Group } from "types";
import "./GroupNameInput.css"

export interface Props {
  group: Group,
  setEditing: Function,
}

export const GroupNameInput = ({group, setEditing}: Props) => {
  const [{}, dispatch] = useStateValue();

  // Set group name of given id
  const setGroupName = (id: string, name: string) => {
    dispatch({
      type: "SET_GROUP_NAME",
      id: id,
      name: name,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditing(false);
    }
  }

  return (
    <input
      title="input group name"
      className="group_name_input" 
      autoFocus
      value={group.name}
      onChange={e=>setGroupName(group.id, e.target.value)}
      onBlur={()=>setEditing(false)}
      onKeyDown={e=>handleKeyDown(e)}/> 
  )
}