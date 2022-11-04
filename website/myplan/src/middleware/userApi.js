import {apiClient} from "./apiClient";

import {getToken} from "./storage";

const token = getToken() ?? "";

export function getDashboards(userId){
    return apiClient.get(`Dashboard/get/user/${userId}`);
}

export function addDashboard(name){
    return apiClient.post("Dashboard/create",
    {name},
    {
        headers: {
            'Authorization': `bearer ${token}`, 'Content-Type': 'application/json'
        }
    })
}