import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { UserTypeProvider } from './UserTypeContext';


ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
    <UserTypeProvider>
      <App />
    </UserTypeProvider>

    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
