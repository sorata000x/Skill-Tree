import { useStateValue } from "StateProvider";
import "./UpdateLog.css"
import React from "react";

export const UpdateLog = () => {
  const [{popUp}, ] = useStateValue();

  return (
    popUp?.type === "update_log" ?
    <div className="update_log">
      <h1>Updates</h1> <br />
      --- Aug 27 2023 --- <br />
      <br />
      <h2>Features</h2>
      <strong>Website Icon</strong>
       - Added Skill Tree icon for the website <br />
      <br />
      <h2>Bug Fix</h2>
      <strong>Typing White Space For Group Name</strong>
       - Fixed the bug that group name input cancel editing if typing a white space <br />
      <br /> <br />
      --- Aug 26 2023 --- <br />
      <br />
      <h2>Features</h2>
      <strong>Group Tab Sorting</strong> 
       - Change the order of group tabs by dragging them to your desired position! <br />
      <br />
      <strong>Long Title Fits</strong> 
       - You can make your skill title super long and it will still fit in its skill node <br />
       <br />
      <h2>Improvement</h2>
      <strong>Better Skill Node Dropping Behavior</strong>
       - Allow dragging target skill node under different nodes including its neighbor without sub-nodes <br />
    </div> : null
  )
}