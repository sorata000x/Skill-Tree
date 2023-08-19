import React, { createRef, useEffect, useRef, useState } from "react";
import { FiMoreHorizontal, FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import type { Group } from "types";
import { useStateValue } from "StateProvider";
import "./MoreMenu.css";

export const MoreMenu = () => {
  const [{ popUp }, dispatch] = useStateValue();
  const ref: React.RefObject<HTMLDivElement> = createRef();
  const [top, setTop] = useState(-999);
  const [left, setLeft] = useState(-999);

  useEffect(() => {
    if (!popUp || popUp.type !== "more_pop_up" || !popUp.top || !popUp.left) {
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
    if (!popUp || !popUp.group) return;
    dispatch({
      type: "DELETE_GROUP",
      id: popUp.group.id,
    });
    close();
  };

  const handleEdit = (e: React.MouseEvent) => {
    popUp?.editGroupName?.();
    close();
  };

  return popUp?.type === "more_pop_up" ? (
    <div ref={ref} style={{ top: top, left: left }} className="more_pop_up">
      <button onClick={handleDelete}>
        <FaRegTrashAlt />
        Delete
      </button>
      <button onClick={handleEdit}>
        <FiEdit />
        Rename
      </button>
    </div>
  ) : null;
};
