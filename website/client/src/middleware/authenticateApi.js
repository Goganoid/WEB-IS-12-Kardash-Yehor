import {apiClient} from "./apiClient";


export function login(email, password) {
    return apiClient.post("Users/login", {email, password}, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function register(firstName, lastName, email, password) {
    return apiClient.post("Users/register", {firstName, lastName, email, password}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}