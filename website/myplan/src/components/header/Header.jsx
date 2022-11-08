import React from 'react'
import { isLoggedIn } from '../../middleware/storage';

import { Link } from 'react-router-dom';
import './Header.css'
import { UserProfileMenu } from '../UserProfileMenu/UserProfileMenu';
export const Header = () => {
  return (
    <>
    <div id="header" className="white">
            <div class="header-text">
                <Link to="/">MyPlan</Link>
            </div>
            <div class="buttons">
                {
                   <UserProfileMenu></UserProfileMenu>
                }
                
            </div>
        </div>
    </>
  )
}
