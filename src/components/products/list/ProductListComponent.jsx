import React, { Component } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import ProductService from '../../../services/ProductService.js'

import './ProductListComponent.css'


class ProductListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
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

        ProductService.getProducts(0, this.state.rows, this.state.sortField, this.state.sortOrder).then(
            (response) => {
                this.setState({ products: response.data.content, totalRecords: response.data.totalElements })
            }
        )
    }

    onPage(event) {
        ProductService.getProducts(event.page, this.state.rows, this.state.sortField, this.state.sortOrder).then(
            (response) => {
                this.setState({ products: response.data.content, first: event.first, page: event.page })
            }
        )
    }

    onSort(event) {
        ProductService.getProducts(this.state.page, this.state.rows, event.sortField, event.sortOrder).then(
            (response) => {
                this.setState({ products: response.data.content, sortField: event.sortField, sortOrder: event.sortOrder })
            }
        )
    }

    newProduct() {
        this.props.history.push('products/-1');
    }

    editProduct(id) {
        this.props.history.push(`products/${id}`);
    }

    deleteProduct(id) {
        ProductService.deleteProduct(id).then(
            () => {
                ProductService.getProducts(this.state.page, this.state.rows, this.state.sortField, this.state.sortOrder).then(
                    response => {
                        this.setState({ products: response.data.content, totalRecords: response.data.totalElements });
                        this.messages.show({
                            severity: 'success', summary: '', detail: `Product with id ${id} deleted!`
                        });
                    }
                )
            },
            error => {
                this.messages.show({
                    severity: 'error', summary: '', detail: 'Error deleting product!'
                });
            }
        );
        this.setState({ showDialog: false });
    }

    priceTemplate(rowData) {
        return rowData.price + '€';
    }

    dateTemplate(rowData) {
        return new Date(rowData.creationDate).toDateString();
    }

    stateTemplate(rowData) {
        return <span className={rowData.state === "ACTIVE" ? 'active' : 'discontinued'}>{rowData.state}</span>;
    }

    dialogFooter() {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ showDialog: false })} />
                <Button label="Yes" icon="pi pi-check" onClick={() => this.deleteProduct(this.state.selectedItemId)} />
            </div>
        );
    }

    buttonsTemplate(rowData) {
        return (
            <span>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-button-text" onClick={() => this.editProduct(rowData.id)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => this.setState({ showDialog: true, selectedItemId: rowData.id })}></Button>
            </span>
        )
    }

    render() {
        return (
            <div className="productList">
                <div className="datatable-responsive">
                    <Messages ref={(e) => this.messages = e}></Messages>
                    <DataTable className="p-datatable-responsive" autoLayout={true} header="Product List" value={this.state.products} paginator
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={this.state.rows} totalRecords={this.state.totalRecords} lazy first={this.state.first} onPage={(e) => this.onPage(e)}
                        onSort={(e) => this.onSort(e)} sortField={this.state.sortField} sortOrder={this.state.sortOrder}>
                        <Column field="id" header="Id" sortable ></Column>
                        <Column field="itemCode" header="Item Code" sortable ></Column>
                        <Column field="description" header="Description" sortable></Column>
                        <Column field="price" header="Price" body={(r) => this.priceTemplate(r)} sortable ></Column>
                        <Column field="state" header="State" body={(r) => this.stateTemplate(r)} sortable ></Column>
                        <Column field="creationDate" header="Creation Date" body={(r) => this.dateTemplate(r)} sortable ></Column>
                        <Column field="creator" header="Creator" sortable ></Column>
                        <Column body={(r) => this.buttonsTemplate(r)} style={{ textAlign: 'center', width: '7em' }}></Column>
                    </DataTable>
                    <Dialog header="Confirmation" visible={this.state.showDialog} footer={this.dialogFooter()} onHide={() => this.setState({ showDialog: false })}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            <span>Are you sure you want to proceed?</span>
                        </div>
                    </Dialog>
                </div>
                <div className="buttons">
                    <Button label="New Product" icon="pi pi-plus" onClick={() => this.newProduct()} />
                </div>
            </div>
        );
    }
}

export default ProductListComponent