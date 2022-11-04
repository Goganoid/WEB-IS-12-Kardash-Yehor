import {apiClient} from "./apiClient";

import {getToken} from "./storage";

const token = getToken() ?? "";


export function getDashboardDetails(dashboardId){
    return apiClient.get(`Dashboard/get/${dashboardId}`, 
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}
export function deleteDashboard(dashboardId){
    return apiClient.delete(`Dashboard/delete/${dashboardId}`,{},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}


export function createCard(content,columnId){
    return apiClient.post(`Card/create/${columnId}`,{content},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}
export function deleteCard(cardId){
    return apiClient.delete(`Card/delete/${cardId}`,{},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}

export function updateCardPosition(cardId,sourceIndex,destinationIndex,columnId){
    return apiClient.put(`Card/update/position/${cardId}`,{columnId,destinationIndex,sourceIndex},{
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    })
}

export function addColumn(dashboardId,name){
    return apiClient.post(`Column/create/${dashboardId}`,{name},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}
export function deleteColumn(columnId){
    return apiClient.delete(`Column/delete/${columnId}`,{},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}

export function updateColumnInfo(columnId,name){
    return apiClient.put(`Column/update/${columnId}`,{name},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}

export function updateDashboardBackground(dashboardId,backgroundName){
    return apiClient.put(`Dashboard/update/${dashboardId}/background/${backgroundName}`,{},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    });
}
