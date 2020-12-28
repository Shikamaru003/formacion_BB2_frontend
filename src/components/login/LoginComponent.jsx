import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import AuthenticationService from '../../services/AuthenticationService.js';

import './LoginComponent.css';

class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'admin',
            password: 'admin'
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (AuthenticationService.isLoggedIn()) {
            this.props.history.push('products');
        }
    }

    onChange(event) {
        this.setState(
            { [event.target.name]: event.target.value }
        );
    }

    login() {
        AuthenticationService.login(this.state.username, this.state.password).then(
            (result) => {
                console.log(result)
                this.props.history.push('products');
            },
            error => {
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.messages.show({ severity: 'error', summary: '', detail: message });
            }
        );
    }

    render() {
        return (
            <div className="login" >
                <div className="p-grid p-justify-center" style={{ marginTop: '0px' }}>
                    <div className="p-col-3">
                        <h1>Login</h1>
                        <div className="p-fluid">
                            <div className="p-field p-grid">
                                <label htmlFor="username" className="p-col-fixed" style={{ width: '100px' }}>Username:</label>
                                <div className="p-col">
                                    <InputText name="username" type="text" value={this.state.username} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className="p-field p-grid">
                                <label htmlFor="password" className="p-col-fixed" style={{ width: '100px' }}>Password:</label>
                                <div className="p-col">
                                    <InputText name="password" type="password" value={this.state.password} onChange={this.onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="p-field" style={{ textAlign: 'center' }}>
                            <Button label="Login" disabled={!this.state.username || !this.state.password} onClick={() =>this.login()}/>
                        </div>
                        <Messages ref={(el) => this.messages = el}></Messages>
                    </div>
                </div>
            </div >
        )
    }
}

export default LoginComponent
