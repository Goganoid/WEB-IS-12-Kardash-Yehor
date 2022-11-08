import React from 'react'
import { Link } from 'react-router-dom'
import './Logout.css'
export const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return (
    <div className="logout-container">
            <div className="text-center fs-1">Ви вийшли з аккаунту</div>
            <div className="logout-buttons">
                <Link to='/login'>
                    <button type="button" className="btn btn-primary mx-2">Увійти</button>
                </Link>
                <Link to='/'>
                    <button type="button" className="btn btn-primary mx-2">На головну</button>
                </Link>
            </div>
        </div>
    )
}
