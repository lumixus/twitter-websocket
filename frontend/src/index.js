import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom"
import router from "./Router"
import { GoogleOAuthProvider } from '@react-oauth/google';

// Import Main Styles
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="<your_client_id>">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
