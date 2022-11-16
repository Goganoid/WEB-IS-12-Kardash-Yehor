import React, {useState} from 'react'
import {register} from '../../middleware/authenticateApi';

import './Auth.css';

const validationError = (value) => {
    return (<div className="text-danger">{value}</div>)
}

function Registration({apiClient}) {
    const [errorMessage, setErrorMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");


    let handleSumbit = async e => {
        e.preventDefault();
        setSubmitted(true);
        if (email.length !== '' && firstName !== '' && lastName !== '' && password1 !== '' && password2 !== '' && password1 === password2) {
            let response = await register(firstName, lastName, email, password1);
            if (response.status !== 200) {
                setErrorMessage(response.result.message);
            } else {
                window.location.href = "/login";
            }
        }
    }


    const notEmpty = "Поле не повинно бути пустим"
    return (<>
            <div className="auth-container w-50 mt-5">
                <form onSubmit={handleSumbit} className="auth-form">
                    <div >
                        <label forhtml="InputEmail" className="form-label">Пошта</label>
                        <input type="email" className="form-control" id="InputEmail"
                               onChange={e => setEmail(e.target.value)}/>
                        {submitted && email.length === 0 && validationError(notEmpty)}
                    </div>
                    <div >
                        <label forhtml="InputPassword1" className="form-label">Пароль</label>
                        <input type="password" className="form-control" id="ІnputPassword1"
                               onChange={e => setPassword1(e.target.value)}/>
                        {submitted && password1.length === 0 && validationError(notEmpty)}
                    </div>
                    <div >
                        <label forhtml="InputPassword2" className="form-label">Повторіть пароль</label>
                        <input type="password" className="form-control" id="ІnputPassword2"
                               onChange={e => setPassword2(e.target.value)}/>
                        {submitted && password2.length === 0 && validationError(notEmpty)}
                        {submitted && password1 !== password2 && validationError('Паролі не збігаються')}
                    </div>
                    <div >
                        <label forhtml="FirstName" className="form-label">Ім'я</label>
                        <input type="text" className="form-control" id="FirstName"
                               onChange={e => setFirstName(e.target.value)}/>
                        {submitted && firstName.length === 0 && validationError(notEmpty)}
                    </div>
                    <div >
                        <label forhtml="SecondName" className="form-label">Прізвище</label>
                        <input type="text" className="form-control" id="SecondName"
                               onChange={e => setLastName(e.target.value)}/>
                        {submitted && lastName.length === 0 && validationError(notEmpty)}
                    </div>

                    <button type="submit" className="auth-btn">Зареєструватися</button>
                </form>
                {errorMessage !== "" && <div className="text-danger">{errorMessage}</div>}
            </div>

        </>)
}

export default Registration