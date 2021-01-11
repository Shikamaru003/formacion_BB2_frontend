import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

import { getProductsService, deleteProductService, deactivateProductService } from '../../services/productService.js'
import { getCurrentUser, isAdmin } from '../../services/authenticationService';

export default function ProductListView() {
    const [products, setProducts] = useState([]);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [rows] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(0);
    const [deactivateReason, setDeactivateReason] = useState('');
    const history = useHistory();
    const messages = useRef(null);

    useEffect(() => {
        loadProducts(page, rows, sortField, sortOrder);

        if (sessionStorage.getItem('message') !== null) {
            messages.current.show(JSON.parse(sessionStorage.getItem('message')));
            sessionStorage.removeItem('message');
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function loadProducts(_page, _rows, _sortField, _sortOrder) {
        getProductsService(page, rows, sortField, sortOrder,
            (response) => { setProducts(response.data.content); setTotalElements(response.data.totalElements); },
            (error_message) => messages.current.show(error_message)
        );
    }

    function onPage(event) {
        setPage(event.page);
        setFirst(event.first);
        loadProducts(event.page, rows, sortField, sortOrder);
    }

    function onSort(event) {
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
        loadProducts(page, rows, event.sortField, event.sortOrder)
    }

    function newProduct() {
        history.push('products/-1');
    }

    function editProduct(id) {
        history.push(`products/${id}`);
    }

    function deleteProduct(id) {
        setShowDeleteDialog(false);
        deleteProductService(id,
            (message) => { loadProducts(page, rows, sortField, sortOrder); messages.current.show(message) },
            (error_message) => messages.current.show(error_message)
        );
    }

    function deactiveProduct(id) {
        setShowDeactivateDialog(false);
        setDeactivateReason('');
        deactivateProductService(id, deactivateReason, getCurrentUser().username,
            (message) => { loadProducts(page, rows, sortField, sortOrder); messages.current.show(message) },
            (error_message) => messages.current.show(error_message)
        );
    }

    function priceTemplate(rowData) {
        return rowData.price + '€';
    }

    function dateTemplate(rowData) {
        return new Date(rowData.creationDate).toDateString();
    }

    function stateTemplate(rowData) {
        return <span className={rowData.state === "ACTIVE" ? 'active' : 'discontinued'}>{rowData.state}</span>;
    }

    function deleteDialogFooter() {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} />
                <Button label="Yes" icon="pi pi-check" onClick={() => deleteProduct(selectedItemId)} />
            </div>
        );
    }


    function deactivateDialogFooter() {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDeactivateDialog(false)} />
                <Button label="Ok" icon="pi pi-check" disabled={deactivateReason === ''} onClick={() => deactiveProduct(selectedItemId)} />
            </div>
        );
    }

    function buttonsTemplate(rowData) {
        return (
            <div style={{ textAlign: 'right' }}>
                {rowData.state === 'ACTIVE' && <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" tooltip="Edit" onClick={() => editProduct(rowData.id)} />}
                {rowData.state === 'ACTIVE' && <Button icon="pi pi-ban" className="p-button-rounded p-button-warning p-button-text" tooltip="Deactive" onClick={() => { setShowDeactivateDialog(true); setSelectedItemId(rowData.id); }} />}
                {isAdmin() && <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" tooltip="Delete" onClick={() => { setShowDeleteDialog(true); setSelectedItemId(rowData.id); }}></Button>}
            </div>
        )
    }

    return (
        <div className="productList">
            <div className="datatable-responsive">
                <Messages ref={messages}></Messages>
                <DataTable className="p-datatable-responsive" autoLayout={true} header="Product List" value={products} paginator
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    rows={rows} totalRecords={totalElements} lazy first={first} onPage={(e) => onPage(e)}
                    onSort={(e) => onSort(e)} sortField={sortField} sortOrder={sortOrder}>
                    <Column field="id" header="Id" sortable ></Column>
                    <Column field="itemCode" header="Item Code" sortable ></Column>
                    <Column field="description" header="Description" sortable ></Column>
                    <Column field="price" header="Price" body={(r) => priceTemplate(r)} sortable ></Column>
                    <Column field="state" header="State" body={(r) => stateTemplate(r)} sortable ></Column>
                    <Column field="creationDate" header="Creation Date" body={(r) => dateTemplate(r)} sortable ></Column>
                    <Column field="creator" header="Creator" sortable ></Column>
                    <Column body={(r) => buttonsTemplate(r)}></Column>
                </DataTable>
                <Dialog header="Confirmation" visible={showDeleteDialog} footer={deleteDialogFooter()} onHide={() => setShowDeleteDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                </Dialog>
                <Dialog header="Deactivate reason" visible={showDeactivateDialog} footer={deactivateDialogFooter()} onHide={() => setShowDeactivateDialog(false)}>
                    <div className="confirmation-content">
                        <InputTextarea rows={5} cols={70} value={deactivateReason} onChange={(e) => setDeactivateReason(e.target.value)} autoResize />
                    </div>
                </Dialog>
            </div>
            <div className="buttons">
                <Button label="New Product" icon="pi pi-plus" onClick={() => newProduct()} />
            </div>
        </div>
    );
}