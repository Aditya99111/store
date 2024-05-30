// ShowInvoice.js
import React, { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../../firebase';
import { useParams } from 'react-router-dom';

const ShowInvoice = ({ invoice: propInvoice }) => {
    const { invoiceId } = useParams();
    const [invoice, setInvoice] = useState(propInvoice || null);

    useEffect(() => {
        if (!propInvoice && invoiceId) {
            const fetchInvoice = async () => {
                const invoiceRef = doc(db, 'invoices', invoiceId);
                const invoiceSnap = await getDoc(invoiceRef);
                if (invoiceSnap.exists()) {
                    setInvoice({ id: invoiceSnap.id, ...invoiceSnap.data() });
                } else {
                    console.error("No such invoice!");
                }
            };

            fetchInvoice();
        }
    }, [invoiceId, propInvoice]);

    if (!invoice) {
        return <div>Loading...</div>;
    }

    const formatDate = (createdAt) => {
        if (createdAt instanceof Date) {
            return createdAt.toLocaleString();
        } else if (createdAt && createdAt.toDate) {
            return createdAt.toDate().toLocaleString();
        } else {
            return new Date(createdAt.seconds * 1000).toLocaleString(); // Fallback for Firestore Timestamp
        }
    };

    return (
        <div>
            <h2>Invoice</h2>
            {invoice.id && <p><strong>Invoice ID:</strong> {invoice.id}</p>}
            <p><strong>Customer Name:</strong> {invoice.customerName}</p>
            <h3>Products</h3>
            {invoice.products.map(product => (
                <div key={product.productId}>
                    <span>Product Name: {product.productName}</span>
                    <span>Quantity: {product.quantity}</span>
                    <span>Price: ${product.price.toFixed(2)}</span>
                </div>
            ))}
            <h3>Total Amount: ${invoice.totalAmount.toFixed(2)}</h3>
            <p><strong>Date:</strong> {formatDate(invoice.createdAt)}</p>
        </div>
    );
};

export default ShowInvoice;
