import React from 'react'
import { useState } from 'react'
import './TablesPage.css'

import { getUserId } from '../../middleware/storage'
import { useEffect } from 'react'
import { addDashboard, getDashboards } from '../../middleware/userApi'
import { Link } from 'react-router-dom'
import { deleteDashboard } from '../../middleware/dashboardApi'
import { UserProfileMenu } from '../../components/UserProfileMenu/UserProfileMenu'
export const TablePage = () => {

    const [dashboards,setDashboards] = useState(null);
    const userId = getUserId();
    useEffect(()=>{
        if(isNaN(userId)) return;
        getDashboards(userId).then((response)=>{
            if(response.status===200) setDashboards(response.result);
        })
    },[userId]);



    if(isNaN(userId)) return <div>Access denied</div>;

    

    const addTable = async (e)=>{
        e.preventDefault();
        let response = await addDashboard("New Table");
        setDashboards([...dashboards,response.result]);  
    }

    const deleteDashboardHook = (id)=>{
        deleteDashboard(id).then(response=>{
            if(response.status===200){
                let newDashboards = dashboards.filter(board=>board.id!==id);
                setDashboards(newDashboards);
            }
        })
    }

  return (
    <>
    
    <div id="header">
        <div className="header-text">
            <Link to="/">MyPlan</Link>
        </div>
        <div className="buttons">
            <UserProfileMenu></UserProfileMenu>
            {/* <a href="" className="user-profile-button">
                <i className="fa-regular fa-user"></i>
            </a> */}
        </div>
    </div>
    <div className="tables-container">
        {
            dashboards==null
            ? <>Loading</>
            :<div className="tables-list">

            {
                dashboards.map((dashboard,idx)=>
                   {
                    let background = require(`../../images/${dashboard.background}`);
                    return <div className="table-option" key={idx}>
                        <div className="delete-board-button" onClick={()=>deleteDashboardHook(dashboard.id)}>
                                <i className="fa-regular fa-circle-xmark"></i>
                            </div>
                        <Link to={`/dashboard/${dashboard.id}`} style={{backgroundImage:`url(${background})`}}>
                            <div className="fade"></div>
                            <div className="table-name">{dashboard.name}</div>
                            
                        </Link>
                    </div>
                    }
                )
            }
            <div className="table-option add-table">
                <a href="" onClick={addTable} >
                    <div className="fade"></div>
                    <i className="fa-duotone fa-plus"></i>
                </a>
            </div>
            
        </div>
        }
        
    </div>
    
    </>
  )
}
