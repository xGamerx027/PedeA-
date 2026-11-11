import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRoutes from './routes';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { ToastProvider } from './components/Toast';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><ToastProvider><AuthProvider><CartProvider><AppRoutes /></CartProvider></AuthProvider></ToastProvider></BrowserRouter></React.StrictMode>);
