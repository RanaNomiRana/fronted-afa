import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './store.ts';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import './index.css';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Render the application
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer /> {/* Add ToastContainer for toasts */}
    </Provider>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
