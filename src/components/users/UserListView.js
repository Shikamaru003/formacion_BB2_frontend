import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { getCurrentUser, isAdmin } from '../../services/authenticationService';
import { getUsersService, deleteUserService } from '../../services/userService';

export default function UserListView() {
    const [users, setUsers] = useState([])
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [rows] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(0);
    const history = useHistory();
    const messages = useRef(null);

    useEffect(() => {
        if (sessionStorage.getItem('message') !== null) {
            messages.current.show(JSON.parse(sessionStorage.getItem('message')));
            sessionStorage.removeItem('message');
        }

        if (!isAdmin()) {
            history.push('/products')
        } else {
            loadUsers(page, rows, sortField, sortOrder);
        }
    }, []);

    function loadUsers(page, rows, sortField, sortOrder) {
        getUsersService(page, rows, sortField, sortOrder,
            (response) => {
                setUsers(response.data.content);
                setTotalElements(response.data.totalElements);
            },
            (error_message) => messages.current.show(error_message)
        )
    }

    function onPage(event) {
        setFirst(event.first);
        setPage(event.page);
        loadUsers(event.page, rows, sortField, sortOrder);
    }

    function onSort(event) {
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
        loadUsers(page, rows, event.sortField, event.sortOrder);
    }

    function newUser() {
        history.push('users/-1');
    }

    function deleteUser(id) {
        setShowDeleteDialog(false);
        deleteUserService(id,
            (message) => {
                loadUsers();
                messages.current.show(message);
            },
            (error_message) => messages.current.show(error_message)
        );
    }

    function dialogFooter() {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} />
                <Button label="Yes" icon="pi pi-check" onClick={() => deleteUser(selectedItemId)} />
            </div>
        );
    }

    function buttonsTemplate(rowData) {
        if (getCurrentUser().username !== rowData.username) {
            return (
                <div>
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text"
                        onClick={() => { setShowDeleteDialog(true); setSelectedItemId(rowData.id) }} />
                </div>
            )
        } else {
            return (<div></div>)
        }
    }

    return (
        <div className="userList">
            <div className="datatable-responsive">
                <Messages ref={messages}></Messages>
                <DataTable className="p-datatable-responsive" header="User List" value={users} paginator
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    rows={rows} totalRecords={totalElements} lazy first={first} onPage={(event) => onPage(event)}
                    onSort={(event) => onSort(event)} sortField={sortField} sortOrder={sortOrder}>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="username" header="Name" sortable></Column>
                    <Column field="role" header="Role" sortable></Column>
                    <Column body={(rowData) => buttonsTemplate(rowData)} style={{ textAlign: 'center', width: '7em' }}></Column>
                </DataTable>
                <Dialog header="Confirmation" visible={showDeleteDialog} footer={dialogFooter()} onHide={() => setShowDeleteDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                </Dialog>
            </div>
            <div className="buttons">
                <Button label="New User" icon="pi pi-plus" onClick={() => newUser()} />
            </div>
        </div>
    );
}