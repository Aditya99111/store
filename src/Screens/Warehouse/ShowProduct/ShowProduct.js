// src/ShowProducts.js
import React, { useState, useEffect } from "react";
import { db, collection, getDocs, doc, updateDoc } from "../../../firebase";

const units = ["kg", "gram", "liter", "milliliter"];

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState(units[0]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setQuantity(product.quantity);
    setPrice(product.price);
    setWeight(product.weight);
    setUnit(product.unit);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productRef = doc(db, "products", editProduct.id);
      await updateDoc(productRef, {
        quantity,
        price,
        weight,
        unit,
      });
      setEditProduct(null);
      const updatedProducts = products.map(product =>
        product.id === editProduct.id
          ? { ...product, quantity, price, weight, unit }
          : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>All Products</h1>
      <input
        type="text"
        placeholder="Search products by name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {filteredProducts.length > 0 ? (
        <ul>
          {filteredProducts.map(product => (
            <li key={product.id}>
              {product.name} - {product.quantity} units @ ₹{product.price} each, {product.weight} {product.unit}
              <button onClick={() => handleEdit(product)}>Edit</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}
      {editProduct && (
        <div>
          <h2>Edit Product</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div>
              <label>Weight:</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                required
              />
              <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShowProducts;
