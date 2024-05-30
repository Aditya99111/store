// CustomerInvoices.js
import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, query, where } from '../../firebase';
import { useParams } from 'react-router-dom';

const CustomerInvoices = () => {
    const { customerId } = useParams();
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            const q = query(collection(db, 'invoices'), where('customerId', '==', customerId));
            const invoicesSnap = await getDocs(q);
            setInvoices(invoicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchInvoices();
    }, [customerId]);

    return (
        <div>
            <h2>Invoices for Customer: {customerId}</h2>
            {invoices.map(invoice => (
                <div key={invoice.id}>
                    <h3>Invoice ID: {invoice.id}</h3>
                    <p><strong>Total Amount:</strong> ${invoice.totalAmount.toFixed(2)}</p>
                    <p><strong>Date:</strong> {new Date(invoice.createdAt.seconds * 1000).toLocaleString()}</p>
                    <h4>Products</h4>
                    {invoice.products.map(product => (
                        <div key={product.productId}>
                            <span>Product Name: {product.productName}</span>
                            <span>Quantity: {product.quantity}</span>
                            <span>Price: ${product.price}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CustomerInvoices;
