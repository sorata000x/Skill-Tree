import React, { createRef } from "react";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useMain, useUser } from "StateProvider";
import "./MoreMenu.css";
import { useNavigate } from "react-router-dom";
import { Group } from "types";

export interface Props {
  group: Group;
  style: {
    top: number;
    left: number;
  };
  editGroupName: Function;
}

/**
 * Menu that contains buttons to operate on group tab
 */
export const MoreMenu = ({
  group,
  style,
  editGroupName,
}: Props) => {
  const [{ groups }, dispatchUser] = useUser();
  const [{}, dispatchMain] = useMain();
  const ref: React.RefObject<HTMLDivElement> = createRef();
  const navigate = useNavigate();

  const close = () => {
    dispatchMain({
      type: "CLOSE_POP_UP"
    }) 
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // delete group
    dispatchUser({
      type: "DELETE_GROUP",
      id: group.id,
    });
    // navigate to first tab in groups
    navigate(`/${groups[0].id}`);
    // close menu
    close();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent onBlur for GroupNameInput from firing
    editGroupName();
    close();
  };

  return (
    <div className="overlay" onClick={(e) => close()}>
      <div
        ref={ref}
        style={style}
        className="more_menu"
        onClick={(e) => e.stopPropagation()}
      >
        <button onMouseDown={(e) => handleDelete(e)}>
          <FaRegTrashAlt />
          Delete
        </button>
        <button onMouseDown={(e) => handleEdit(e)}>
          <FiEdit />
          Rename
        </button>
      </div>
    </div>
  )
};
