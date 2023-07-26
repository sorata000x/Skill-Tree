import React from 'react'
import { useStateValue } from '../../StateProvider';
import { HiOutlinePlus } from 'react-icons/hi';
import './SideBar.css'

function SideBar({setGroup}) {
  
  const [{groups}, dispatch] = useStateValue();

  const addNewGroup = () => {
    dispatch({
      type: "ADD_NEW_GROUP",
    })
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
          <button 
            className='group_tab'
            onClick={(e)=>setGroup(name)}>
            {name}
          </button>)
        }
      </div>
    </div>
  )
}

export default SideBar
