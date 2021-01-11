import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import { getProductByIdService, saveProductService, updateProductService, deleteProductService } from '../../services/productService.js'
import { getAllSuppliersService, getAvailableSuppliersService } from '../../services/supplierService.js'
import { priceReductionService } from '../../services/priceReductionService.js'

export default function ProductDetailView() {
    const [product, setProduct] = useState({});
    const [availableSuppliers, setAvailableSuppliers] = useState([]);
    const [availablePriceReductions, setAvailablePriceReductions] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const states = ['ACTIVE', 'DISCONTINUED'];
    const history = useHistory();
    const params = useParams();
    const messages = useRef(null);

    // constructor(props) {
    //     super(props);
    //     state = {
    //         product: {
    //             id: null,
    //             itemCode: null,
    //             description: '',
    //             state: 'ACTIVE',
    //             price: 0,
    //             creator: getCurrentUser().username,
    //             creationDate: new Date(),
    //             priceReductions: [],
    //             suppliers: []
    //         },
    //         availableSuppliers: [],
    //         availablePriceReductions: []
    //     };

    //     states = ['ACTIVE', 'DISCONTINUED'];

    // }

    useEffect(() => {
        if (params.id === '-1') {
            getAllSuppliersService().then(
                (suppliers) => {
                    setAvailableSuppliers(suppliers.data)
                }
            );
            priceReductionService.getAllPriceReductions().then(
                (priceReductions) => {
                    setAvailablePriceReductions(priceReductions)
                }
            );
        } else {
            loadProduct(params.id);
        }
    }, [])

    function loadProduct(id) {
        getProductByIdService(id,
            (response) => {
                console.log(response.data)
                if (response.data === null) {
                    history.push('/products');
                }
                else {
                    setProduct(response.data);
                    getAvailableSuppliersService(product.id).then(
                        (suppliers) => {
                            setAvailableSuppliers(suppliers.data)
                        }
                    );
                    priceReductionService.getAvailablePriceReductions(product.id).then(
                        (priceReductions) => {
                            setAvailablePriceReductions(priceReductions.data)
                        }
                    );
                }
            },
            (message) => {
                history.push('/products')
            }
        )
    }

    function saveProduct() {
        if (product.description === '' || product.itemCode === null) {
            messages.show({
                severity: 'error', summary: '', detail: 'Product Code and Description can´t be empty!'
            });
        } else {
            saveProductService(product,
                (response) => {
                    setProduct(response.data);
                    history.push(`products/${product.id}`);
                },
                (message) => messages.show(message)
            );
        }
    }

    function updateProduct() {
        if (product.description === '' || product.itemCode === null) {
            messages.show({
                severity: 'error', summary: '', detail: 'Product Code and Description can´t be empty!'
            });
        }
        else {
            updateProductService(product,
                (response) => {
                    setProduct(response.data);
                },
                (message) => {
                    messages.current.show(message);
                }
            );
        }
    }

    function deleteProduct() {
        showDeleteDialog(false);
        deleteProductService(product.id,
            () => {
                history.push('/products');
            },
            (message) => history.push({
                pathname: '/products',
                state: { message: message }
            })
        )
    }

    function onChange(event) {
        setProduct({ ...product, [event.target.id]: event.target.value });
    }

    function onSupplierSelectChange(event) {
        setAvailableSuppliers(event.source)
        setProduct({ ...product, suppliers: event.target.target });
    }

    function onPriceReductionSelectChange(event) {
        setAvailablePriceReductions(event.source)
        setProduct({ ...product, priceReductions: event.target.target });
    }

    function supplierTemplate(item) {
        return (
            <div className="supplier-item">
                <h4 className="supplier-name">{item.name}</h4>
                <i className="pi pi-tag"></i>
                <span className="supplier-country">{item.country}</span>
            </div>
        );
    }

    function priceReductionTemplate(item) {
        return (
            <div className="price-reduction-item">
                <h4 className="price-reduction-price">{item.reducedPrice}</h4>
                <div className="price-reduction-dates">(From <b>{new Date(item.startDate).toLocaleDateString()}</b> To <b>{new Date(item.endDate).toLocaleDateString()}</b>)</div>
            </div>
        );
    }

    function dialogFooter() {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => showDeleteDialog(false)} />
                <Button label="Yes" icon="pi pi-check" onClick={() => deleteProduct()} />
            </div>
        );
    }

    // render() {
    //     let buttons;
    //     if (product.id === null) {
    //         buttons = <Button label="Save" icon="pi pi-save" onClick={() => saveProduct()}></Button>
    //     } else {
    //         buttons =
    //             <div>
    //                 <Button label="Update" icon="pi pi-save" style={{ marginRight: '5px' }} onClick={() => updateProduct()}></Button>
    //                 <Button label="Delete" icon="pi pi-trash" className="p-button-danger" style={{ marginRight: '5px' }} onClick={() => setState({ showDialog: true })}></Button>
    //                 <Dialog header="Confirmation" visible={showDialog} footer={dialogFooter()} onHide={() => setState({ showDialog: false })}>
    //                     <div className="confirmation-content">
    //                         <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
    //                         <span>Are you sure you want to proceed?</span>
    //                     </div>
    //                 </Dialog>
    //             </div>
    //     }
    // }

    return (
        <div className="productDetail">
            <Messages ref={messages}></Messages>
            <Panel header="Product Detail">
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-3">
                        <label htmlFor="itemCode">Code</label>
                        <InputNumber id="itemCode" value={product.itemCode} useGrouping={false} onValueChange={(e) => onChange(e)} disabled={params.id !== '-1'} />
                    </div>
                    <div className="p-field p-col-9">
                        <label htmlFor="description">Description</label>
                        <InputText id="description" type="text" value={product.description} onChange={(e) => onChange(e)} />
                    </div>
                    <div className="p-field p-col-3">
                        <label htmlFor="creator">Creator</label>
                        <InputText id="creator" type="text" value={product.creator} disabled />
                    </div>
                    <div className="p-field p-col-3">
                        <label htmlFor="state">State</label>
                        <Dropdown id="state" value={product.state} options={states} onChange={(e) => onChange(e)} disabled />
                    </div>
                    <div className="p-field p-col-3">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={product.price} mode="currency" currency="EUR" onValueChange={(e) => onChange(e)} />
                    </div>
                    <div className="p-field p-col-3">
                        <label htmlFor="creationDate">Creation Date</label>
                        <Calendar id="creationDate" readOnly="{true}" value={new Date(product.creationDate)} onChange={(e) => onChange(e)} showIcon disabled={params.id === '-1'} />
                    </div>
                    <div className="p-field p-col-12" style={{ textAlign: 'center' }}>
                        <label htmlFor="suppliers">Suppliers</label>
                        <PickList id="suppliers" source={availableSuppliers} target={product.suppliers} itemTemplate={(i) => supplierTemplate(i)}
                            sourceHeader="Available" targetHeader="Selected"
                            sourceStyle={{ height: '200px' }} targetStyle={{ height: '200px' }}
                            onChange={(e) => onSupplierSelectChange(e)}></PickList>
                    </div>
                    <div className="p-field p-col-12" style={{ textAlign: 'center' }}>
                        <label htmlFor="priceReductions">Price Reductions</label>
                        <PickList id="priceReductions" source={availablePriceReductions} target={product.priceReductions} itemTemplate={(i) => priceReductionTemplate(i)}
                            sourceHeader="Available" targetHeader="Selected"
                            sourceStyle={{ height: '200px' }} targetStyle={{ height: '200px' }}
                            onChange={(e) => onPriceReductionSelectChange(e)}></PickList>
                    </div>
                </div>
            </Panel>
            <div className="buttons">
                {/* {buttons} */}
            </div>
        </div>
    );
}
