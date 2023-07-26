import React from 'react'
import { useStateValue } from '../../StateProvider';
import { HiOutlinePlus } from 'react-icons/hi';
import './SideBar.css'
import { Link } from "react-router-dom";
import { auth } from '../../firebase';

function SideBar() {
  
  const [{user, groups}, dispatch] = useStateValue();

  const addNewGroup = () => {
    dispatch({
      type: "ADD_NEW_GROUP",
    })
  }

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "SIGN_OUT",
      })
      dispatch({
        type: "CLEAR_SKILL",
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
        {groups?.map(name => 
          <Link to={`/${name}`}>
            <button 
              className='group_tab'>
              {name}
            </button>
          </Link>
          )
        }
      </div>
      { user ?
        <button 
          className='user_btn' 
          onClick={handleAuthentication}>
          {user.email}
        </button> :
        <Link to={!user && '/login'}>
          <button 
            className='user_btn' >
            Login
          </button>
        </Link> }
    </div>
  )
}

export default SideBar
