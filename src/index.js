import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {nhost} from './utility/nhost';
import { NhostProvider } from '@nhost/react';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <NhostProvider nhost={nhost}>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme="light"
    />
  </NhostProvider>
);