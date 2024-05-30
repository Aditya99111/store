import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WareHouse from './Screens/Warehouse/WareHouse';
import StoreFront from './Screens/StoreFront/StoreFront';
import ShowInvoice from './Screens/StoreFront/ShowInvoice';
import CustomerInvoices from './Screens/StoreFront/CustomerInvoices';
import "./App.css"
const App = () => {
  return (
    <Router>
      <div className='app'>
             <Routes>
          <Route path="/warehouse" element={<WareHouse />} />
          <Route path="/storefront" element={<StoreFront />} />
          <Route path="/invoice/:invoiceId" element={<ShowInvoice />} />
          <Route path="/customer/:customerId" element={<CustomerInvoices />} />


        </Routes>
      </div>
    </Router>
  );
};

export default App;
