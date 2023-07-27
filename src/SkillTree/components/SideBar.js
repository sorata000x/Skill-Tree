import React, { useState } from 'react'
import { useStateValue } from '../../StateProvider';
import { HiOutlinePlus } from 'react-icons/hi';
import './SideBar.css'
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../../firebase';
import { v4 as uuid } from 'uuid';
import { FiSidebar } from 'react-icons/fi';

function SideBar({openAuth}) {
  
  const [open, setOpen] = useState(true);
  const [{user, groups, activeGroup}, dispatch] = useStateValue();
  const navigate = useNavigate();

  const addNewGroup = () => {
    let newGroup = {
      id: uuid(),
      name: `Group ${groups.length+1}`
    }
    dispatch({
      type: "ADD_NEW_GROUP",
      group: newGroup,
    })
    dispatch({
      type: "SET_ACTIVE_GROUP",
      activeGroup: newGroup,
    })
    navigate(`/${newGroup.id}`);
  }

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "SIGN_OUT",
      })
    }
  }

  const NewGroupButton = () => {
    return (
      <button 
        className='new_group_button' 
        onClick={addNewGroup}>
        <HiOutlinePlus 
          className='new_group_add_icon' 
          size={10}/>
        New Group
      </button>
    )
  }

  const CloseSidebarButton = () => {
    return (
      <button 
        className='sidebar_button close'
        onClick={()=>setOpen(false)}>
        <FiSidebar />
      </button>
    )
  }

  const OpenSidebarButton = () => {
    return (
      <button 
        className='sidebar_button open'
        onClick={()=>setOpen(true)}>
        <FiSidebar />
      </button>
    )
  }

  const GroupTabs = () => {
    const setActiveGroup = (group) => {
      dispatch({
        type: "SET_ACTIVE_GROUP",
        activeGroup: group,
      })
      navigate(`/${group.id}`);
    }

    return (
      groups?.map(group => 
      <Link to={`/${group.id}`}>
        <button 
          className={'group_tab' + (activeGroup?.id === group.id ? ' active' : '')}
          onClick={(e)=>setActiveGroup(group)}>
          {group.name}
        </button>
      </Link>
    ))
  }

  const UserButton = () => {
    return ( 
      user ?
      <button 
        className='user_btn' 
        onClick={handleAuthentication}>
        {user.email}
      </button> :
      <button
        className='user_btn'
        onClick={(e)=>openAuth()}>
        Login
      </button>
    )
  }

  return (
    open ?
    <div className='side_bar_container'>
      <div className='action_buttons_container'>
        <NewGroupButton />
        <CloseSidebarButton />
      </div>
      <div className='group_tabs_container'>
        <GroupTabs />
      </div>
      <UserButton />
    </div> :
    <OpenSidebarButton />
  )
}

export default SideBar
