import "./SupportPage.css";
import React from "react";
import { useStateValue } from "StateProvider";

/**
 * Page contains information to provide user support
 */
export const SupportPage = () => {
  const [, dispatch] = useStateValue();

  const close = () => {
    dispatch({
      type: "CLOSE_POP_UP"
    })
  }

  return (
    <div className="overlay" onClick={(e)=>close()}>
      <div className="support_page">
        <p>Hello! Welcome to Skill Tree!</p> <br />
        <p>I am Aiden, the only developer of this website right now.</p> <br />
        <p>This website is currently under development, so there is still many features not being implemented and bugs to fix.</p> <br />
        <p>If you have any question, suggestions, or bug report for the website, please feel free to contact me through any of the following way</p> <br />
        <p><strong>Email:</strong> mic035@ucsd.edu <br /> <strong>Discord:</strong> sora1215</p> <br />
        <p>I will be happy to hear any feedback from you!</p> <br />
      </div>
    </div>
  )
}