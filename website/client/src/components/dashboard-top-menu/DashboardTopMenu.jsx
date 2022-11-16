import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Editable } from '../Editable/Editable'
import './DashboardTopMenu.css'


const backgrounds = [
  'background1.jpg',
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
  'background5.jpg',
  'background6.jpg',
]

export const DashboardTopMenu = ({ name, memberships, changeBackgroundHook, addUserHook, removeUserHook,role, changeDashboardNameHook }) => {
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showShareSelector, setShowShareSelector] = useState(false);
  const toggleShowBackgroundSelector = () => setShowBackgroundSelector(!showBackgroundSelector);
  const toggleShowShareSelector = () => setShowShareSelector(!showShareSelector);



  let [email, setEmail] = useState("");
  let [newUserRole, setNewUserRole] = useState("2");
  let handleAddUserSumbit = e => {
    e.preventDefault();
    if (email.length === 0 || newUserRole.length === 0 || isNaN(parseInt(newUserRole))) {
      alert("Incorrect data");
      return;
    }
    addUserHook(email, newUserRole);
  }
  let removeUser = (id) => {
    removeUserHook(id);
  }

  return (
    <>
      <div className="menu">
     
        <Editable
        hook={(name)=>{ changeDashboardNameHook(name)}}
        disabled={role!==0}
        >
          <div>{name}</div>
        </Editable>
        
        <button disabled={role!==0}>
          <span
            onClick={toggleShowShareSelector}
          >Share</span>
          {
            showShareSelector ?
              (
                <div className="selector share">
                  <h2>Users</h2>

                  <div className="dashboard-users">
                    {
                      memberships.map(membership => {

                        let role = undefined;
                        switch (membership.memberRole) {
                          case 0: role = "Owner"; break;
                          case 1: role = "Editor"; break;
                          case 2: role = "Guest"; break;
                          default: role = "error";
                        }


                        return <div className="dashboard-user" key={membership.memberId}>
                          <span className="name">{`${membership.member.firstName} ${membership.member.lastName}`}</span>
                          <span className="role">{role}</span>
                          {membership.memberRole !== 0
                            ?
                            <i className="fa-regular fa-circle-xmark remove-user-button" onClick={() => removeUser(membership.memberId)}></i>
                            :
                            null
                          }

                        </div>
                      })
                    }


                    <div className='add-user-form'>
                      <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                      <label for="roles"></label>
                      <select name="roles" onChange={(e) => setNewUserRole(e.target.value)}>
                        <option value="2">Guest</option>
                        <option value="1">Editor</option>
                      </select>
                      <div onClick={handleAddUserSumbit}>Confirm</div>
                    </div>
                  </div>
                </div>
              )
              :
              null
          }
        </button>
        <button
          disabled={role!==0}
          className='background-menu'
          onClick={toggleShowBackgroundSelector}
        >Backgrounds <i className="fa-solid fa-arrow-turn-down"></i>
          {
            showBackgroundSelector ?
              (<div className="selector">
                <h2>Backgrounds</h2>
                {backgrounds.map(background => {
                  let backgroundImg = require(`../../images/${background}`);
                  return <div className="background-preview-container" onClick={() => changeBackgroundHook(background)}>
                    <div className="overlay"></div>
                    <img src={backgroundImg} className="background-preview" alt="Loading..." />
                  </div>

                })}
              </div>)
              :
              <></>
          }

        </button>
        <Link to="/profile" className="user-profile-button">
          <i className="fa-regular fa-user"></i>
        </Link>
      </div>
    </>
  )
}
