import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { UserNewsProvider } from './context/UserNewsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserNewsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserNewsProvider>
  </React.StrictMode>
);