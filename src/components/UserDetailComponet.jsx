import React, { Component } from 'react';

import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import UserService from '../services/userService.js'

class UserDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: null,
                username: '',
                password: '',
                role: ''
            },
        };

        this.roles = ['ROLE_ADMIN', 'ROLE_USER'];
    }

    componentDidMount() {
        if (this.props.match.params.id !== '-1') {
            this.loadUser(this.props.match.params.id);
        }
    }

    loadUser(id) {
        UserService.getUserById(id).then(
            (response) => {
                this.setState({ user: response.data });
                if (this.state.user.id == null) {
                    this.props.history.push('../users');
                }
            },
            error => {
                return this.props.history.push('../users');
            }
        )
    }

    saveUser() {
        if (this.state.user.username === '' || this.state.user.password === '' || this.state.user.role === '') {
            this.messages.show({
                severity: 'error', summary: '', detail: 'User name, password and role can´t be empty!'
            });
        }
        else {
            UserService.saveUser(this.state.user).then(
                response => {
                    this.setState({ user: response.data });
                    this.props.history.push({
                        pathname: '/users',
                        state: {
                            message: {
                                severity: 'success', summary: '', detail: `User created!`
                            }
                        }
                    })
                },
                error => {
                    this.messages.show({
                        severity: 'error', summary: '', detail: error.response.data.message
                    });
                }
            );
        }
    }

    onChange(event) {
        this.setState(
            { user: { ...this.state.user, [event.target.id]: event.target.value } }
        );
    }

    render() {
        return (
            <div className="userDetail">
                <Messages ref={(e) => this.messages = e}></Messages>
                <Panel header="User Detail">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-4">
                            <label htmlFor="username">Name</label>
                            <InputText id="username" type="text" value={this.state.user.username} onChange={(e) => this.onChange(e)} />
                        </div>
                        <div className="p-field p-col-4">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" type="password" value={this.state.user.password} onChange={(e) => this.onChange(e)} />
                        </div>
                        <div className="p-field p-col-4">
                            <label htmlFor="role">Role</label>
                            <Dropdown id="role" value={this.state.user.role} options={this.roles} onChange={(e) => this.onChange(e)} />
                        </div>
                    </div>
                </Panel>
                <div className="buttons">
                    <Button label="Save" icon="pi pi-save" style={{ marginRight: '5px' }} onClick={() => this.saveUser()}></Button>
                </div>
            </div>
        );
    }
}

export default UserDetailComponent