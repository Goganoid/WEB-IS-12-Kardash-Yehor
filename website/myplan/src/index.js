import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Root from './Root';
import { Start } from './views/Start/Start';
import Registration from './views/Auth/Registration';
import Login from './views/Auth/Login';
import Dashboard from './views/Dashboard/Dashboard';
import { TablePage } from './views/TablesPage/TablesPage';
import { Logout } from './views/Logout/Logout';
import { ProtectedRoute } from './views/ProtectedRoute/ProtectedRoute';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children:[
      {
        index:true,
        element:<Start></Start>
      },
      {
        path:"dashboard/:dashboardId",
        element:<ProtectedRoute>
          <Dashboard></Dashboard>
        </ProtectedRoute>
      },
      {
        path:"register",
        element:<Registration></Registration>
      },
      {
        path:"login",
        element:<Login></Login>
      },
      {
        path:"profile",
        element:<ProtectedRoute>
          <TablePage></TablePage>
        </ProtectedRoute>
      },
      {
        path:"logout",
        element:<Logout></Logout>
      }
    ]
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
// </React.StrictMode>
);

