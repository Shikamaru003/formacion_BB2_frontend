import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import { saveUserService } from '../../services/userService.js'

export default function UserDetailView() {

    const [user, setUser] = useState({ username: '', password: '', role: '' });
    const roles = ['ROLE_ADMIN', 'ROLE_USER'];
    const history = useHistory();
    const messages = useRef(null);

    function saveUser() {
        console.log(user)
        if (user.username === '' || user.password === '' || user.role === '') {
            messages.current.show({
                severity: 'error', summary: '', detail: 'User name, password and role can´t be empty!'
            });
        }
        else {
            saveUserService(user,
                (message) => {
                    sessionStorage.setItem('message', JSON.stringify(message));
                    history.push('/users');
                },
                (error_message) => {
                    messages.current.show(error_message);
                }
            );
        }
    }

    function onChange(event) {
        setUser({ ...user, [event.target.id]: event.target.value })
    }

    return (
        <div className="userDetail">
            <Messages ref={messages}></Messages>
            <Panel header="User Detail">
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-4">
                        <label htmlFor="username">Name</label>
                        <InputText id="username" type="text" value={user.username} onChange={(event) => onChange(event)} />
                    </div>
                    <div className="p-field p-col-4">
                        <label htmlFor="password">Password</label>
                        <InputText id="password" type="password" value={user.password} onChange={(event) => onChange(event)} />
                    </div>
                    <div className="p-field p-col-4">
                        <label htmlFor="role">Role</label>
                        <Dropdown id="role" value={user.role} options={roles} onChange={(event) => onChange(event)} />
                    </div>
                </div>
            </Panel>
            <div className="buttons">
                <Button label="Save" icon="pi pi-save" style={{ marginRight: '5px' }} onClick={() => saveUser()}></Button>
            </div>
        </div>
    );
}
