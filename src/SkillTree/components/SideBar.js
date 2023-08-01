import React, { useState, useEffect, useRef } from "react";
import { useStateValue } from "../../StateProvider";
import { HiOutlinePlus } from "react-icons/hi";
import { BiSolidEditAlt } from "react-icons/bi"
import "./SideBar.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import { v4 as uuid } from "uuid";
import { FiSidebar } from "react-icons/fi";

function SideBar({ openAuth }) {
  const [open, setOpen] = useState(true);
  const [{ user, groups, activeGroup }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const urlParam = useParams().pathParam;
  const [hovering, setHovering] = useState('');
  const [editing, setEditing] = useState('');

  const addNewGroup = () => {
    let newGroup = {
      id: uuid(),
      name: `Group ${groups.length + 1}`,
    };
    dispatch({
      type: "ADD_NEW_GROUP",
      group: newGroup,
    });
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: newGroup.id,
    });
    navigate(`/${newGroup.id}`);
  };

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "SIGN_OUT",
      });
      navigate('/');
    } else {
      openAuth();
    }
  };

  const NewGroupButton = () => {
    return (
      <button className="new_group_button" onClick={addNewGroup}>
        <HiOutlinePlus className="new_group_add_icon" size={14} />
        New Group
      </button>
    );
  };

  const CloseSidebarButton = () => {
    return (
      <button className="sidebar_button close" onClick={() => setOpen(false)}>
        <FiSidebar />
      </button>
    );
  };

  const OpenSidebarButton = () => {
    return (
      <button className="sidebar_button open" onClick={() => setOpen(true)}>
        <FiSidebar />
      </button>
    );
  };

  const setActiveGroup = (group) => {
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: group.id,
    });
    navigate(`/${group.id}`);
  };

  const handleGroupBtnClick = (e, group) => {
    navigate(`/${group.id}`);
    setActiveGroup(group);
  }

  const setGroupName = (id, name) => {
    dispatch({
      type: "SET_GROUP_NAME",
      id: id,
      name: name,
    })
  }

  const handleGroupNameInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditing(null);
    }
  }

  return open ? (
    <div 
      className="side_bar_container">
      <div className="action_buttons_container">
        <NewGroupButton />
        <CloseSidebarButton />
      </div>
      <div className="group_tabs_container">
        {groups?.map((group) => (
            <button
              className="group_tab"
              style={urlParam === group.id ? {backgroundColor: 'rgb(220, 220, 220)'} : {}}
              onClick={(e) => handleGroupBtnClick(e, group)}
              onMouseEnter={() => setHovering(group.id)}
              onMouseLeave={() => setHovering(null)} 
            >
              { editing !== group.id ?
                group.name :
                <input 
                  className="group_input" 
                  autoFocus
                  value={group.name}
                  onChange={(e)=>{setGroupName(group.id, e.target.value)}}
                  onBlur={(e)=>setEditing(null)}
                  onKeyDown={handleGroupNameInputKeyDown}/> 
                  }
              { group.id === hovering && editing !== group.id &&
                <BiSolidEditAlt 
                  className="edit_btn"
                  size={21}
                  onClick={(e)=>setEditing(group.id)}/>}
            </button>
        ))}
      </div>
      <button className="user_btn" onClick={handleAuthentication}>
        {user ? user.email : 'Login'}
      </button>
    </div>
  ) : (
    <OpenSidebarButton />
  );
}

export default SideBar;
