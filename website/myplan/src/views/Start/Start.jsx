import React from 'react';
import './Start.css';

import { Header } from '../../components/header/Header';
export const Start = () => {


    var crossPlatformImage = require('../../images/cross-platform.png')

    return (
        <>
        <Header></Header>
        <div id="intro">
            <div className="intro-container">
                <h2>MyPlan boosts your productivity</h2>
                <p>Collaborate, manage projects, and reach new productivity peaks.</p>
                <ul>
                    <li>Fast</li>
                    <li>Feature rich</li>
                    <li>Easy to use</li>
                    <li>Totally free</li>
                </ul>
            
            </div>
            <div className="intro-container">
                <div className="cube">
                    <div className="face cube-top"></div>
                    <div className="face cube-bottom"></div>
                    <div className="face cube-left"></div>
                    <div className="face cube-right"></div>
                    <div className="face cube-front"></div>
                    <div className="face cube-back"></div>
                </div>
            </div>

        </div>
        <div id="quote">
            <h1>"Productivity is never an accident. It is always the result of a commitment to intelligent planning and focused effort."</h1>
            <div>- Paul J.Meyer</div>
        </div>
        <div id="description">
            <div className="container">
                <div className="container-img"><img src={crossPlatformImage} alt="Screenshot"/></div>
                <div className="text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio beatae sint sapiente quidem laborum numquam placeat veniam minus ut, temporibus cum doloribus cumque, nostrum maxime, consequatur ad enim iste suscipit.</div>
            </div>
        </div>
        <div id="sign-form">
            <div className="container">
                <div className="text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio beatae sint sapiente quidem laborum numquam placeat veniam minus ut, temporibus cum doloribus cumque, nostrum maxime, consequatur ad enim iste suscipit.</div>
                <button className="style-button">Sign Up</button>
            </div>
         </div>
        </>
    )
}
