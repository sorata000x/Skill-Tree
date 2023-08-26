import { useStateValue } from "StateProvider";
import "./UpdateLog.css"
import React from "react";

export const UpdateLog = () => {
  const [{popUp}, ] = useStateValue();

  return (
    popUp?.type === "update_log" ?
    <div className="update_log">
      <h1>Updates</h1> <br />
      --- Aug 26 2023 --- <br />
      <br />
      <h2>Features</h2>
      <strong>Group Tab Sorting</strong> 
       - Change the order of group tabs by dragging them to your desired position! <br />
      <br />
      <strong>Long Title Fits</strong> 
       - You can make your skill title super long and it will still fit in its skill node <br />
    </div> : null
  )
}