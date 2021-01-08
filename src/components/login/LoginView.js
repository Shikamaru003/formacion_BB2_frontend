import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import authenticationService from '../../services/authenticationService.js';

export default function LoginView() {

    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const history = useHistory();
    const messages = useRef(null);

    useEffect(() => {
        if (authenticationService.isLoggedIn()) {
            history.push('products');
        }
    });

    function login() {
        authenticationService.login(username, password).then(
            () => {
                history.push('products');
            })
            .catch(
                error => {
                    console.log(error.response)
                    const message =
                        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    messages.current.show({ severity: 'error', summary: '', detail: message });
                }
            );
    }

    return (
        <div className="login" >
            <div className="p-grid p-justify-center" style={{ marginTop: '0px' }}>
                <div className="p-col-3">
                    <h1>Login</h1>
                    <div className="p-fluid">
                        <div className="p-field p-grid">
                            <label htmlFor="username" className="p-col-fixed" style={{ width: '100px' }}>Username:</label>
                            <div className="p-col">
                                <InputText name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </div>
                        <div className="p-field p-grid">
                            <label htmlFor="password" className="p-col-fixed" style={{ width: '100px' }}>Password:</label>
                            <div className="p-col">
                                <InputText name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="p-field" style={{ textAlign: 'center' }}>
                        <Button label="Login" disabled={!username || !password} onClick={login} />
                    </div>
                    <Messages ref={messages}></Messages>
                </div>
            </div>
        </div >
    )
}

