import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStoreFrontAuth } from './StoreFrontAuthContext';

const StoreFrontPrivateRoute = ({ children }) => {
  const { currentUser } = useStoreFrontAuth();
  return currentUser ? children : <Navigate to="/storefront-login" />;
};

export default StoreFrontPrivateRoute;