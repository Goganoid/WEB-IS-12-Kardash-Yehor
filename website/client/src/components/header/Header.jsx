import React from 'react'

import { Link } from 'react-router-dom';
import './Header.css'
import { UserProfileMenu } from '../UserProfileMenu/UserProfileMenu';
export const Header = () => {
  return (
    <>
    <div id="header" className="white">
            <div className="header-text">
                <Link to="/">MyPlan</Link>
            </div>
            <div className="buttons">
                {
                   <UserProfileMenu></UserProfileMenu>
                }
                
            </div>
        </div>
    </>
  )
}
