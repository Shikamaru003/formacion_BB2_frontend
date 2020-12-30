import React, { Component } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';

import AuthenticationService from '../services/AuthenticationService';

class HeaderComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined,
            showAdminMenu: false,
        }

        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.navigateToPage = this.navigateToPage.bind(this);
    }

    componentDidMount() {
        const user = AuthenticationService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showAdminMenu: user.roles.includes("ROLE_ADMIN")
            });
        }
    }

    navigateToPage(path) {
        console.log('Navigate to path ' + path);
        this.props.history.push(path);
    }

    onLogoutClick() {
        AuthenticationService.logout();
        this.navigateToPage('/login');
    }

    render() {
        let menu_items = [];

        if (AuthenticationService.isLoggedIn()) {
            menu_items.push(
                {
                    label: 'Products',
                    icon: 'pi pi-list',
                    command: () => {
                        this.navigateToPage(`/products`)
                    }
                }
            )
            if (AuthenticationService.isAdmin()) {
                menu_items.push(
                    {
                        label: 'Users',
                        icon: 'pi pi-users',
                        command: () => {
                            this.navigateToPage('/users')
                        }
                    }
                )
            }
        } else {
            menu_items.push(
                {
                    label: 'Home',
                    icon: 'pi pi-home',
                    command: () => {
                        this.navigateToPage('/login')
                    }
                }
            )
        }


        return (
            <div className="header">
                <Menubar model={menu_items} end={AuthenticationService.isLoggedIn() && <Button icon="pi pi-power-off" label="Logout" className="p-button-rounded" onClick={this.onLogoutClick}></Button>}></Menubar>
            </div>
        );
    }
}

export default withRouter(HeaderComponent);