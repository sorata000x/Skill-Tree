import React, { createRef, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useStateValue } from "StateProvider";
import "./MoreMenu.css";
import { useNavigate } from "react-router-dom";

export const MoreMenu = () => {
  const [{ groups, popUp }, dispatch] = useStateValue();
  const ref: React.RefObject<HTMLDivElement> = createRef();
  const [top, setTop] = useState(-999);
  const [left, setLeft] = useState(-999);
  const navigate = useNavigate();

  useEffect(() => {
    if (!popUp || popUp.type !== "more_menu" || !popUp.top || !popUp.left) {
      setTop(-999);
      setLeft(-999);
    } else {
      setTop(popUp.top + 30);
      setLeft(popUp.left + 0);
    }
  }, [popUp]);

  const close = () => {
    dispatch({
      type: "CLOSE_POP_UP",
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!popUp || !popUp.group) return;
    dispatch({
      type: "DELETE_GROUP",
      id: popUp.group.id,
    });
    navigate(`/${groups[0].id}`);
    close();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();   // Prevent onBlue for GroupNameInput from firing
    popUp?.editGroupName?.();
    close();
  };

  return popUp?.type === "more_menu" ? (
    <div 
      ref={ref} 
      style={{top: top, left: left}} 
      className="more_menu">
      <button onMouseDown={(e)=>handleDelete(e)}>
        <FaRegTrashAlt />
        Delete
      </button>
      <button onMouseDown={(e)=>handleEdit(e)}>
        <FiEdit />
        Rename
      </button>
    </div>
  ) : null;
};
