import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUserType } from './UserTypeContext';

const PrivateRoute = ({ element, allowedUserTypes }) => {
  const { userType } = useUserType();

  if (allowedUserTypes.includes(userType)) {
    return <Route element={element} />;
  } else {
    // Redirect to the login page or another route
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
