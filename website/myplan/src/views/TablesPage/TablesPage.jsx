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
        if(userId==NaN) return;
        getDashboards(userId).then((response)=>{
            console.log(response);
            if(response.status===200) setDashboards(response.result);
        })
    },[]);


    console.log(dashboards);

    if(userId==NaN) return <div>Access denied</div>;

    

    const addTable = async (e)=>{
        e.preventDefault();
        let response = await addDashboard("New Table");
        console.log(response);
        setDashboards([...dashboards,response.result]);  
    }

    const deleteDashboardHook = (id)=>{
        deleteDashboard(id).then(response=>{
            console.log(response);
            if(response.status===200){
                let newDashboards = dashboards.filter(board=>board.id!=id);
                setDashboards(newDashboards);
            }
        })
    }

  return (
    <>
    
    <div id="header">
        <div class="header-text">
            <Link to="/">MyPlan</Link>
        </div>
        <div class="buttons">
            <UserProfileMenu></UserProfileMenu>
            {/* <a href="" class="user-profile-button">
                <i class="fa-regular fa-user"></i>
            </a> */}
        </div>
    </div>
    <div class="tables-container">
        {
            dashboards==null
            ? <>Loading</>
            :<div class="tables-list">

            {
                dashboards.map((dashboard,idx)=>
                   {
                    console.log(dashboard.background);
                    let background = require(`../../images/${dashboard.background}`);
                    return <div class="table-option" key={idx}>
                        <div class="delete-board-button" onClick={()=>deleteDashboardHook(dashboard.id)}>
                                <i class="fa-regular fa-circle-xmark"></i>
                            </div>
                        <Link to={`/dashboard/${dashboard.id}`} style={{backgroundImage:`url(${background})`}}>
                            <div class="fade"></div>
                            <div class="table-name">{dashboard.name}</div>
                            
                        </Link>
                    </div>
                    }
                )
            }
            <div class="table-option add-table">
                <a href="" onClick={addTable} >
                    <div class="fade"></div>
                    <i class="fa-duotone fa-plus"></i>
                </a>
            </div>
            
        </div>
        }
        
    </div>
    
    </>
  )
}
