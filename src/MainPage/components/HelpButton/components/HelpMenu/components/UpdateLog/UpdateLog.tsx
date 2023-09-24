import { useStateValue } from "StateProvider";
import "./UpdateLog.css";
import React from "react";

/**
 * Update log page to show what has been updated
 */
export const UpdateLog = () => {
  const [, dispatch] = useStateValue();

  const close = () => {
    dispatch({
      type: "CLOSE_POP_UP",
    });
  };

  return (
    <div className="overlay" onClick={(e) => close()}>
      <div className="update_log">
        <h1>Updates</h1> <br />
        --- Sep 23 2023 --- <br />
        <br />
        <h2>Feature</h2>
        <strong>Tree Zooming</strong>
        - You can now adjust the tree size with buttons for a better view of your trees! <br />
        <br />
        <br />
        --- Sep 9 2023 --- <br />
        <br />
        <h2>Feature</h2>
        <strong>Link Embedding Editor Toolbar</strong>
        - Link can be embedded into text from the editor toolbar. <br />
        <br />
        <br />
        --- Sep 5 2023 --- <br />
        <br />
        <h2>Improvement</h2>
        <strong>Better Skill Icon Upload Button</strong>
        - Make skill icon upload button looks better <br />
        <br />
        <br />
        --- Aug 27 2023 --- <br />
        <br />
        <h2>Features</h2>
        <strong>Website Icon</strong>
        - Added Skill Tree icon for the website <br />
        <br />
        <h2>Bug Fix</h2>
        <strong>Typing White Space For Group Name</strong>
        - Fixed the bug that group name input cancel editing if typing a white
        space <br />
        <br /> <br />
        --- Aug 26 2023 --- <br />
        <br />
        <h2>Features</h2>
        <strong>Group Tab Sorting</strong>
        - Change the order of group tabs by dragging them to your desired
        position! <br />
        <br />
        <strong>Long Title Fits</strong>
        - You can make your skill title super long and it will still fit in its
        skill node <br />
        <br />
        <h2>Improvement</h2>
        <strong>Better Skill Node Dropping Behavior</strong>
        - Allow dragging target skill node under different nodes including its
        neighbor without sub-nodes <br />
      </div>
    </div>
  );
};
