import { useStateValue } from "StateProvider";
import "./HelpMenu.css"
import React, {createRef, useEffect} from "react";
import { RiLightbulbLine } from "react-icons/ri";
import { GiNewShoot } from "react-icons/gi";

// Need to update this file every deployment for now
// Version: SkillTree major.minor.patch

export interface Props {
  open: boolean,
  close: Function,
}

export const HelpMenu = ({open, close}: Props) => {
  const [{popUp}, dispatch] = useStateValue();
  const updateTime = new Date("2023-08-26T16:45:00");
  const ref: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
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

  const handleClickSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "SET_POP_UP",
      popUp: {
        type: "support_page",
        focus: true,
      },
    });
    close();
  };

  const handleClickUpdates = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "SET_POP_UP",
      popUp: {
        type: "update_log",
        focus: true,
      },
    });
    close();
  };

  const timePass = () => {
    const currentTime = new Date();
    const timePass = currentTime.valueOf() - updateTime.valueOf();
    if (Math.floor(timePass / (1000 * 3600 * 24)) > 0) {
      return `${Math.floor(timePass / (1000 * 3600 * 24))} days`;
    } else if (Math.floor(timePass / (1000 * 3600)) > 0) {
      return `${Math.floor(timePass / (1000 * 3600))} hours`;
    } else if (Math.floor(timePass / (1000 * 60)) > 0) {
      return `${Math.floor(timePass / (1000 * 60))} minutes`;
    } else if (Math.floor(timePass / (1000)) > 0) {
      return `${Math.floor(timePass / (1000))} seconds`;
    }
    return `0 second`;
  }

  return (
    open ? ( 
    <div className="help_menu" ref={ref}>
      <div className="button_container">
        <button onClick={(e)=>handleClickSupport(e)}> 
          <RiLightbulbLine /> 
          Support 
        </button>
        <button onClick={(e)=>handleClickUpdates(e)}>
          <GiNewShoot />
          Updates
        </button>
      </div>
      <div className="divider"></div>
      <div className="update_container">
        SkillTree 0.18.0 <br />
        Updated {timePass()} ago
      </div>
    </div>) : null
  )
}