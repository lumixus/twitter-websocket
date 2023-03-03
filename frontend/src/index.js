import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom"
import router from "./Router"
import { GoogleOAuthProvider } from '@react-oauth/google';
import {Provider} from "react-redux"
import store from './Store';


// Import Main Styles
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './Auth/Auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="<your_client_id>">
        <Auth>
          <RouterProvider router={router} />
        </Auth>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
