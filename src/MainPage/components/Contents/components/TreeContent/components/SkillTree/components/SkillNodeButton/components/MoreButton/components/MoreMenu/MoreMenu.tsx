import React, { createRef, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { useMain } from "StateProvider";
import "./MoreMenu.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AddButton, DeleteButton } from "./components";
import { Skill } from "types";

export interface Props {
  style: {
    top: number;
    left: number;
  };
  skill: Skill,
}

/**
 * Menu that contains buttons to operate on group tab
 */
export const MoreMenu = ({
  style,
  skill,
}: Props) => {
  const [{}, dispatch] = useMain();
  const ref: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
    // Close self if clicked outside
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const close = () => {
    dispatch({
      type: "CLOSE_POP_UP"
    })
  }

  return (
    <div className="menu_overlay" onClick={(e) => close()} ref={ref}>
      <div
        style={style}
        className="menu"
        onClick={(e) => e.stopPropagation()}
      >
        <AddButton skill={skill} />
        <DeleteButton skill={skill} />
      </div>
    </div>
  );
};
