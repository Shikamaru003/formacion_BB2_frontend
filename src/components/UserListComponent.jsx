import React, { Component } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { getCurrentUser, isAdmin } from '../services/authenticationService';
import UserService from '../services/userService';

class UserListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            first: 0,
            page: 0,
            rows: 10,
            totalRecords: 0,
            sortField: '',
            sortOrder: 1,
            showDialog: false,
            selectedItemId: 0
        };
    }

    componentDidMount() {
        if (this.props.history.location.state) {
            this.messages.show(this.props.history.location.state.message);
        }

        if (!isAdmin()) {
            this.props.history.push('/products')
        } else {
            UserService.getUsers(0, this.state.rows, this.state.sortField, this.state.sortOrder).then(
                (response) => {
                    this.setState({ users: response.data.content, totalRecords: response.data.totalElements })
                }
            )
        }
    }

    onPage(event) {
        UserService.getUsers(event.page, this.state.rows, this.state.sortField, this.state.sortOrder).then(
            (response) => {
                this.setState({ users: response.data.content, first: event.first, page: event.page })
            }
        )
    }

    onSort(event) {
        UserService.getUsers(this.state.page, this.state.rows, event.sortField, event.sortOrder).then(
            (response) => {
                this.setState({ users: response.data.content, sortField: event.sortField, sortOrder: event.sortOrder })
            }
        )
    }

    newUser() {
        this.props.history.push('users/-1');
    }

    editUser(id) {
        this.props.history.push(`users/${id}`);
    }

    deleteUser(id) {
        UserService.deleteUser(id).then(
            () => {
                UserService.getUsers(this.state.page, this.state.rows, this.state.sortField, this.state.sortOrder).then(
                    (response) => {
                        this.setState({ users: response.data.content, totalRecords: response.data.totalElements })
                        this.messages.show({
                            severity: 'success', summary: '', detail: `User with id ${id} deleted!`
                        });
                    }
                )
            },
            error => {
                this.messages.show({
                    severity: 'error', summary: '', detail: 'Error deleting user!'
                });
            }
        );
        this.setState({ showDialog: false });
    }

    dialogFooter() {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ showDialog: false })} />
                <Button label="Yes" icon="pi pi-check" onClick={() => this.deleteUser(this.state.selectedItemId)} />
            </div>
        );
    }

    buttonsTemplate(rowData) {
        if (getCurrentUser().username !== rowData.username) {
            return (
                <div>
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => this.setState({ showDialog: true, selectedItemId: rowData.id })} />
                </div>
            )
        } else {
            return (<div></div>)
        }
    }

    render() {
        return (
            <div className="userList">
                <div className="datatable-responsive">
                    <Messages ref={(e) => this.messages = e}></Messages>
                    <DataTable className="p-datatable-responsive" header="User List" value={this.state.users} paginator
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={this.state.rows} totalRecords={this.state.totalRecords} lazy first={this.state.first} onPage={(e) => this.onPage(e)}
                        onSort={(e) => this.onSort(e)} sortField={this.state.sortField} sortOrder={this.state.sortOrder}>
                        <Column field="id" header="Id" sortable></Column>
                        <Column field="username" header="Name" sortable></Column>
                        <Column field="role" header="Role" sortable></Column>
                        <Column body={(rowData) => this.buttonsTemplate(rowData)} style={{ textAlign: 'center', width: '7em' }}></Column>
                    </DataTable>
                    <Dialog header="Confirmation" visible={this.state.showDialog} footer={this.dialogFooter()} onHide={() => this.setState({ showDialog: false })}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            <span>Are you sure you want to proceed?</span>
                        </div>
                    </Dialog>
                </div>
                <div className="buttons">
                    <Button label="New User" icon="pi pi-plus" onClick={() => this.newUser()} />
                </div>
            </div>
        );
    }
}

export default UserListComponent