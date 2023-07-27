import React from 'react'
import { useStateValue } from '../../StateProvider';
import { HiOutlinePlus } from 'react-icons/hi';
import './SideBar.css'
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../../firebase';
import { v4 as uuid } from 'uuid';

function SideBar({openAuth}) {
  
  const [{user, groups}, dispatch] = useStateValue();
  const navigate = useNavigate();

  const addNewGroup = () => {
    let newGroupID = uuid();
    dispatch({
      type: "ADD_NEW_GROUP",
      id: newGroupID,
      name: `Group ${groups.length+1}`,
    })
    navigate(`/${newGroupID}`);
  }

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "SIGN_OUT",
      })
    }
  }

  return (
    <div className='side_bar_container'>
      <div className='action_buttons_container'>
        <button className='new_group_button' onClick={addNewGroup}>
          <HiOutlinePlus 
            className='new_group_add_icon' 
            size={10}/>
          New Group
        </button>
        <button className='close_sidebar_button'>
        </button>
      </div>
      <div className='group_tabs_container'>
        {groups?.map(group => 
          <Link to={`/${group.id}`}>
            <button 
              className='group_tab'>
              {group.name}
            </button>
          </Link>
        )}
      </div>
      { user ?
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
      }
    </div>
  )
}

export default SideBar
