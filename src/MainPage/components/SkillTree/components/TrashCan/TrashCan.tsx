import React from "react";
import "./TrashCan.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { useStateValue } from "StateProvider";
import { useSortable } from "@dnd-kit/sortable";

export const TrashCan = () => {
  const [{sideBarOpen}, ] = useStateValue();

  const { setNodeRef } =
    useSortable({
      id: "trash_can",
      transition: { duration: 300, easing: "ease" },
    });

  return (
    <div 
      className="trash_can"
      style={sideBarOpen ? {left: "260px"} : {left: "45px"}}
      ref={setNodeRef}
      > 
      <FaRegTrashAlt size={26} />
    </div>
  )
}