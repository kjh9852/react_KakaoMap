import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MapContextProvider } from './store/map-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MapContextProvider>
    <App />
  </MapContextProvider>
);