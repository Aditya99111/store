// MakeBill.js
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import ShowInvoice from './ShowInvoice';
const MakeBill = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedCustomerName, setSelectedCustomerName] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [invoiceData, setInvoiceData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            const customersSnap = await getDocs(collection(db, 'customers'));
            setCustomers(customersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        const fetchProducts = async () => {
            const productsSnap = await getDocs(collection(db, 'products'));
            const productsData = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
            setFilteredProducts(productsData);
        };

        fetchCustomers();
        fetchProducts();
    }, []);

    useEffect(() => {
        const lowercasedFilter = searchQuery.toLowerCase();
        const filteredData = products.filter(item =>
            item.name.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredProducts(filteredData);
    }, [searchQuery, products]);

    const handleAddProduct = (product, quantity) => {
        if (quantity > product.quantity) {
            alert('Quantity exceeds available stock');
            return;
        }

        const existingProduct = selectedProducts.find(item => item.id === product.id);
        let updatedProducts;
        if (existingProduct) {
            updatedProducts = selectedProducts.map(item => {
                if (item.id === product.id) {
                    return { ...item, selectedQuantity: quantity };
                }
                return item;
            });
        } else {
            updatedProducts = [...selectedProducts, { ...product, selectedQuantity: quantity }];
        }

        setSelectedProducts(updatedProducts);
        const newTotal = updatedProducts.reduce((total, item) => total + item.price * item.selectedQuantity, 0);
        setTotalAmount(newTotal);
    };

    const handleInputChange = (product, event) => {
        const value = event.target.value;
        const quantity = value === '' ? 0 : parseInt(value, 10);
        if (!isNaN(quantity)) {
            handleAddProduct(product, quantity);
        }
    };

    const handleCompleteBill = async () => {
        try {
            const invoice = {
                customerId: selectedCustomer,
                customerName: selectedCustomerName,
                products: selectedProducts.map(product => ({
                    productId: product.id,
                    productName: product.name, // Include product name here
                    quantity: product.selectedQuantity,
                    price: product.price,
                })),
                totalAmount,
                createdAt: new Date()
            };

            const invoiceRef = await addDoc(collection(db, 'invoices'), { ...invoice, createdAt: serverTimestamp() });

            // Update product quantities
            for (let product of selectedProducts) {
                const productRef = doc(db, 'products', product.id);
                await updateDoc(productRef, {
                    quantity: product.quantity - product.selectedQuantity
                });
            }

            alert('Bill completed successfully');
            setInvoiceData(invoice);
            setSelectedCustomer('');
            setSelectedProducts([]);
            setTotalAmount(0);

            // Redirect to the invoice page
            navigate(`/invoice/${invoiceRef.id}`);
        } catch (error) {
            console.error("Error completing bill: ", error);
        }
    };

    return (
        <div>
            {invoiceData ? (
                <ShowInvoice invoice={invoiceData} />
            ) : (
                <>
                    <h2>Make Bill</h2>
                    <select value={selectedCustomer} onChange={(e) => {
                        setSelectedCustomer(e.target.value);
                        const customer = customers.find(cust => cust.id === e.target.value);
                        setSelectedCustomerName(customer ? customer.name : '');
                    }}>
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                    <div>
                        <h3>Select Products</h3>
                        <input 
                            type="text" 
                            placeholder="Search Products" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {filteredProducts.map(product => (
                            <div key={product.id}>
                                <span>{product.name} - {product.weight}{product.unit} - Rs{product.price} (Available: {product.quantity})</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    placeholder="Quantity"
                                    onChange={(e) => handleInputChange(product, e)}
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3>Selected Products</h3>
                        {selectedProducts.map(product => (
                            <div key={product.id}>
                                <span>{product.name} - {product.selectedQuantity} units - {product.weight}kg - ${product.price}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
                        <button onClick={handleCompleteBill}>Complete Bill</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MakeBill;
