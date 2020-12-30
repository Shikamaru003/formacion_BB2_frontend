import React, { Component } from 'react';

import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';

import ProductService from '../../../services/ProductService.js'
import SupplierService from '../../../services/SupplierService.js'
import PriceReductionService from '../../../services/PriceReductionService.js'
import AuthenticationService from '../../../services/AuthenticationService.js';

import './ProductDetailComponent.css';


class ProductDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: {
                id: null,
                itemCode: null,
                description: '',
                state: 'ACTIVE',
                price: 0,
                creator: AuthenticationService.getCurrentUser().username,
                creationDate: new Date(),
                priceReductions: [],
                suppliers: []
            },
            availableSuppliers: [],
            availablePriceReductions: []
        };

        this.states = ['ACTIVE', 'DISCONTINUED'];
    }

    componentDidMount() {
        if (this.props.match.params.id === '-1') {
            SupplierService.getAllSuppliers().then(
                (suppliers) => {
                    this.setState({ availableSuppliers: suppliers.data })
                }
            );
            PriceReductionService.getAllPriceReductions().then(
                (priceReductions) => {
                    this.setState({ availablePriceReductions: priceReductions.data })
                }
            );
        } else {
            this.loadProduct(this.props.match.params.id);
        }
    }

    loadProduct(id) {
        ProductService.getProductById(id).then(
            response => {
                this.setState({ product: response.data });
                if (this.state.product.id == null) {
                    this.props.history.push('/products');
                }
                else {
                    SupplierService.getAvailableSuppliers(this.state.product.id).then(
                        (suppliers) => {
                            this.setState({ availableSuppliers: suppliers.data })
                        }
                    );
                    PriceReductionService.getAvailablePriceReductions(this.state.product.id).then(
                        (priceReductions) => {
                            this.setState({ availablePriceReductions: priceReductions.data })
                        }
                    );
                }
            },
            error => {
                this.props.history.push('/products')
            }
        )
    }

    saveProduct() {
        if (this.state.product.description === '' || this.state.product.itemCode === null) {
            this.messages.show({
                severity: 'error', summary: '', detail: 'Product Code and Description can´t be empty!'
            });
        }

        ProductService.saveProduct(this.state.product).then(
            response => {
                this.setState({ product: response.data });
                this.props.history.push(`./${this.state.product.id}`);
                this.messages.show({
                    severity: 'success', summary: '', detail: 'Product saved!'
                });
            },
            error => {
                this.messages.show({
                    severity: 'error', summary: '', detail: 'Error saving product!'
                });
            }
        );
    }

    updateProduct() {
        if (this.state.product.description === '' || this.state.product.itemCode === null) {
            this.messages.show({
                severity: 'error', summary: '', detail: 'Product Code and Description can´t be empty!'
            });
        }

        ProductService.updateProduct(this.state.product).then(
            () => {
                this.messages.show({
                    severity: 'success', summary: '', detail: 'Product updated!'
                });
            },
            error => {
                this.messages.show({
                    severity: 'error', summary: '', detail: 'Error updating product!'
                });
            }
        );
    }

    deleteProduct() {
        this.setState({ showDialog: false })
        ProductService.deleteProduct(this.state.product.id).then(
            () => {
                this.props.history.push({
                    pathname: '/products',
                    state: {
                        message: {
                            severity: 'success', summary: '', detail: `Product with id ${this.state.product.id} deleted!`
                        }
                    }
                })
            },
            error => {
                this.messages.show({
                    severity: 'error', summary: '', detail: 'Error deleting product!'
                });
            }
        );
    }

    onChange(event) {
        this.setState(
            { product: { ...this.state.product, [event.target.id]: event.target.value } }
        );
    }

    onSupplierSelectChange(event) {
        this.setState({
            availableSuppliers: event.source,
            product: { ...this.state.product, suppliers: event.target }
        });
    }

    onPriceReductionSelectChange(event) {
        this.setState({
            availablePriceReductions: event.source,
            product: { ...this.state.product, priceReductions: event.target }
        });
    }

    supplierTemplate(item) {
        return (
            <div className="product-item">
                <h5 className="p-mb-2">{item.name}</h5>
                <i className="pi pi-tag product-category-icon"></i>
                <span className="product-category">{item.country}</span>
            </div>
        );
    }

    priceReductionTemplate(item) {
        return (
            <div className="product-item">
                <h4 className="p-mb-2">{item.reducedPrice}</h4>
                <div className="product-category">From {new Date(item.startDate).toLocaleDateString()}</div>
                <div className="product-category">To {new Date(item.endDate).toLocaleDateString()}</div>
            </div>
        );
    }

    dialogFooter() {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ showDialog: false })} />
                <Button label="Yes" icon="pi pi-check" onClick={() => this.deleteProduct()} />
            </div>
        );
    }

    render() {
        let buttons;
        if (this.state.product.id === null) {
            buttons = <Button label="Save" icon="pi pi-save" onClick={() => this.saveProduct()}></Button>
        } else {
            buttons =
                <div>
                    <Button label="Update" icon="pi pi-save" style={{ marginRight: '5px' }} onClick={() => this.updateProduct()}></Button>
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" style={{ marginRight: '5px' }} onClick={() => this.setState({ showDialog: true })}></Button>
                    <Dialog header="Confirmation" visible={this.state.showDialog} footer={this.dialogFooter()} onHide={() => this.setState({ showDialog: false })}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            <span>Are you sure you want to proceed?</span>
                        </div>
                    </Dialog>
                </div>
        }

        return (
            <div className="productDetail">
                <Messages ref={(e) => this.messages = e}></Messages>
                <Panel header="Product Detail">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-3">
                            <label htmlFor="itemCode">Code</label>
                            <InputNumber id="itemCode" value={this.state.product.itemCode} useGrouping={false} onValueChange={(e) => this.onChange(e)} disabled={this.props.match.params.id !== '-1'} />
                        </div>
                        <div className="p-field p-col-9">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" type="text" value={this.state.product.description} onChange={(e) => this.onChange(e)} />
                        </div>
                        <div className="p-field p-col-3">
                            <label htmlFor="creator">Creator</label>
                            <InputText id="creator" type="text" value={this.state.product.creator} disabled />
                        </div>
                        <div className="p-field p-col-3">
                            <label htmlFor="state">State</label>
                            <Dropdown id="state" value={this.state.product.state} options={this.states} onChange={(e) => this.onChange(e)} disabled />
                        </div>
                        <div className="p-field p-col-3">
                            <label htmlFor="price">Price</label>
                            <InputNumber id="price" value={this.state.product.price} mode="currency" currency="EUR" onValueChange={(e) => this.onChange(e)} />
                        </div>
                        <div className="p-field p-col-3">
                            <label htmlFor="creationDate">Creation Date</label>
                            <Calendar id="creationDate" readOnly="{true}" value={new Date(this.state.product.creationDate)} onChange={(e) => this.onChange(e)} showIcon disabled={this.props.match.params.id === '-1'} />
                        </div>
                        <div className="p-field p-col-6" style={{ textAlign: 'center' }}>
                            <label htmlFor="suppliers">Suppliers</label>
                            <PickList id="suppliers" source={this.state.availableSuppliers} target={this.state.product.suppliers} itemTemplate={(i) => this.supplierTemplate(i)}
                                sourceHeader="Available" targetHeader="Selected"
                                sourceStyle={{ height: '300px' }} targetStyle={{ height: '300px' }}
                                onChange={(e) => this.onSupplierSelectChange(e)}></PickList>
                        </div>
                        <div className="p-field p-col-6" style={{ textAlign: 'center' }}>
                            <label htmlFor="priceReductions">Price Reductions</label>
                            <PickList id="priceReductions" source={this.state.availablePriceReductions} target={this.state.product.priceReductions} itemTemplate={(i) => this.priceReductionTemplate(i)}
                                sourceHeader="Available" targetHeader="Selected"
                                sourceStyle={{ height: '300px' }} targetStyle={{ height: '300px' }}
                                onChange={(e) => this.onPriceReductionSelectChange(e)}></PickList>
                        </div>
                    </div>
                </Panel>
                <div className="buttons">
                    {buttons}
                </div>
            </div>
        );
    }
}

export default ProductDetailComponent