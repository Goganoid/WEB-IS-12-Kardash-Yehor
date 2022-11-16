import React from 'react'
import { isLoggedIn } from '../../middleware/storage';

export const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn()) {
      return <>
        <div>Access denied</div>
      </>
    }
  
    return children;
  };