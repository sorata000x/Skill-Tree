import "./ActionButtons.css";
import React from "react";

export interface Props {
  close: Function;
}

export const ActionButtons = ({ close }: Props) => {
  return (
    <div className="action_buttons">
      <button className="ok" type="submit">
        OK
      </button>
      <button className="cancel" type="button" onClick={(e) => close()}>
        Cancel
      </button>
    </div>
  );
};