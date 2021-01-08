import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

import { getProductsService, deleteProductService, deactivateProductService } from '../../services/productService.js'
import authenticationService from '../../services/authenticationService.js'

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
        getProductsService(page, rows, sortField, sortOrder, (data) => { setProducts(data.content); setTotalElements(data.totalElements) });

        if (history.location.state) {
            messages.current.show(history.location.state.message);
        }

    }, [history.location.state, page, rows, sortField, sortOrder]);

    function onPage(event) {
        getProductsService(event.page, rows, sortField, sortOrder,
            (data) => { setProducts(data.content); setPage(event.page); setFirst(event.first); });
    }

    function onSort(event) {
        getProductsService(page, rows, event.sortField, event.sortOrder,
            (data) => { setProducts(data.content); setSortField(event.sortField); setSortOrder(event.sortOrder); });
    }

    function newProduct() {
        history.push('products/-1');
    }

    function editProduct(id) {
        history.push(`products/${id}`);
    }

    function deleteProduct(id) {
        deleteProductService(id, page, rows, sortField, sortOrder, messages,
            (data) => { setProducts(data.content); setTotalElements(data.totalElements); setShowDeleteDialog(false); })
    }

    function deactiveProduct(id) {
        deactivateProductService(id, deactivateReason, authenticationService.getCurrentUser().username, page, rows, sortField, sortOrder,
            (data) => { setProducts(data.content); setTotalElements(data.totalElements) },
            messages)
        setShowDeactivateDialog(false);
        setDeactivateReason('');
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
                {authenticationService.isAdmin() && <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" tooltip="Delete" onClick={() => { setShowDeleteDialog(true); setSelectedItemId(rowData.id); }}></Button>}
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