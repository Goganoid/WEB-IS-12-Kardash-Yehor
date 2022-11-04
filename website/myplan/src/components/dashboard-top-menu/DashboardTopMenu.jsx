import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './DashboardTopMenu.css'


const backgrounds = [
  'background1.jpg',
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
  'background5.jpg',
  'background6.jpg',
]

export const DashboardTopMenu = ({name,changeBackgroundHook}) => {
  const [showBackgroundSelector,setShowBackgroundSelector] = useState(false);
  const toggleShowBackgroundSelector = ()=> setShowBackgroundSelector(!showBackgroundSelector);
  return (
    <> 
    <div class="menu">
            <div>{name}</div>
            <button>Share </button>
            <button
            className='background-menu'
            onClick={toggleShowBackgroundSelector}
            >Backgrounds <i class="fa-solid fa-arrow-turn-down"></i>
            {
              showBackgroundSelector ?
              (<div class="background-selector">
              <h2>Backgrounds</h2>
              {backgrounds.map(background=>{
                 let backgroundImg = require(`../../images/${background}`);
                 return <div class="background-preview-container" onClick={()=>changeBackgroundHook(background)}>
                          <div className="overlay"></div>
                          <img src={backgroundImg} class="background-preview"/>
                        </div>
                  
              })}
            </div>)
              :
              <></>
            } 
            
            </button>
            <Link to="/profile" class="user-profile-button">
                <i class="fa-regular fa-user"></i>
            </Link>
        </div>
    </>
  )
}
