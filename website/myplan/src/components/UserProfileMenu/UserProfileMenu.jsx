import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './UserProfileMenu.css'
import { isLoggedIn } from '../../middleware/storage'
export const UserProfileMenu = () => {
    const [showMenu,setShowMenu] = useState(false);
    const toggleMenu = ()=>setShowMenu(!showMenu);
  return (
    <>
    <div className="user-profile-button">
        <i class="fa-regular fa-user" onClick={toggleMenu}></i>
        {
            showMenu 
            ? 
            <div className="user-profile-menu">
                <Link to="/profile" className="user-profile-menu-element">Profile</Link>
                <Link to="/Logout" className="user-profile-menu-element">Logout</Link>
            </div>
            :
            null

        }
        
    </div>
    </>
    
  )
}
