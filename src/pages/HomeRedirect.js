import React from 'react';
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/tasks" /> : <Navigate to="/login" />;
};

export default HomeRedirect;