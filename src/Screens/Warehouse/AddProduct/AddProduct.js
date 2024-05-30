import React, { useState, useEffect } from "react";
import { db, collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from "../../../firebase";
import "../warehouse.css"
const units = ["kg", "gram", "liter", "milliliter"];

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState(units[0]);
  const [paid, setPaid] = useState(false);
  const [creditorName, setCreditorName] = useState("");
  const [existingProducts, setExistingProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (productName) {
        const normalizedProductName = productName.toLowerCase().trim();
        const q = query(collection(db, "products"), where("normalized_name", "==", normalizedProductName));
        const querySnapshot = await getDocs(q);
        setExistingProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchProducts();
  }, [productName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let productUpdated = false;

      console.log("Existing products:", existingProducts);

      for (let product of existingProducts) {
        console.log(`Checking product: ${product.name} @ ${product.price}`);
        if (product.price === price && product.weight === weight && product.unit === unit) {
          const productRef = doc(db, "products", product.id);
          console.log(`Updating product ID: ${product.id}`);
          await updateDoc(productRef, {
            quantity: product.quantity + quantity,
          });
          productUpdated = true;
          break;
        }
      }

      if (!productUpdated) {
        console.log("Adding new product");
        await addDoc(collection(db, "products"), {
          name: productName,
          normalized_name: productName.toLowerCase().trim(),
          quantity: quantity,
          price: price,
          weight: weight,
          unit: unit,
          createdAt: serverTimestamp(),
        });
      }

      if (!paid) {
        console.log("Adding creditor information");
        await addDoc(collection(db, "creditors"), {
          name: creditorName,
          product: productName,
          quantity: quantity,
          price: price,
          totalAmount: quantity * price,
          createdAt: serverTimestamp(),
        });
      }

      setProductName("");
      setQuantity(0);
      setPrice(0);
      setWeight(0);
      setUnit(units[0]);
      setPaid(false);
      setCreditorName("");
      setExistingProducts([]);

      alert("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  return (
    <div className="addproduct">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="products">
          <p>Product Name:</p>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="inputfield"
            placeholder="Product Name"
          />
          {existingProducts.length > 0 && (
            <div>
              <p>Existing products:</p>
              <ul>
                {existingProducts.map(product => (
                  <li key={product.id}>
                    {product.name} - {product.quantity} units @ ₹ {product.price} each, {product.weight} {product.unit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <p>Quantity:</p>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
            className="inputfield"
            placeholder="Enter Quantity"
          />
        </div>
        <div>
          <p>Price:</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
            className="inputfield"
            placeholder="Enter Price"
          />
        </div>
        <div>
          <p>Weight:</p>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            required
            className="inputfield"
            placeholder="Weigth"
          />
          <select className="inputunit" value={unit} onChange={(e) => setUnit(e.target.value)} required>
            {units.map(unit => (
              <option key={unit} value={unit} >{unit}</option>
            ))}
          </select>
        </div>
          <div className="paidstatus">
          <label>Paid:</label>

          <span className="paid">
          <input
            type="checkbox"
            checked={paid}
            onChange={(e) => setPaid(e.target.checked)}
            className="paid"
          /></span></div>
        {!paid && (
          <div>
            <label>Creditor Name:</label>
            <input
              type="text"
              value={creditorName}
              onChange={(e) => setCreditorName(e.target.value)}
              required

            className="inputfield"
            placeholder="Enter creditors name"
              
            />
          </div>
        )}
        <button type="submit" className="btn">Save</button>
      </form>
    </div>
  );
};

export default AddProduct;