import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {login} from '../../middleware/authenticateApi';
import {setUserData} from '../../middleware/storage';

import './Auth.css'

function Login({apiClient}) {

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [invalidLogin, setInvalidLogin] = useState(false);
    let handleSumbit = async e => {
        e.preventDefault();
        let response = await login(email, password);
        console.log(response);
        if (response.status !== 200) {
            setInvalidLogin(true);
        } else {
            setInvalidLogin(false);
            console.log(response);
            setUserData({token: response.result.token, userId: response.result.id});
            window.location.href = "/";
        }
    }
    return (<div className="auth-container w-25 mt-5">
            <form onSubmit={handleSumbit} className="auth-form">
                <div className="mb-3">
                    <label htmlFor="InputEmail" className="form-label">Пошта</label>
                    <input type="email" className="form-control" id="InputEmail"
                           onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="InputPassword" className="form-label">Пароль</label>
                    <input type="password" className="form-control" id="InputPassword"
                           onChange={e => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="auth-btn btn-primary">Увійти</button>
                <div className="mt-3">
                    <Link to="/register">Не маєте акаунту?</Link>
                </div>
            </form>
            {invalidLogin && <div className="text-danger">Неправильний пароль чи email!</div>}
        </div>)
}

export default Login