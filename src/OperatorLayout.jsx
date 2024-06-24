// AdminLayout.js
import React, { useEffect } from 'react';
import {  Navbar, Footer, Sidebar, ThemeSettings } from './components/PassengerDashboard';

import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';


import { useStateContext } from './contexts/ContextProvider';
const OperatorLayout = ({ children }) => {
    const { setCurrentColor, setCurrentMode, currentMode,  currentColor, themeSettings, setThemeSettings } = useStateContext();

    useEffect(() => {
      const currentThemeColor = localStorage.getItem('colorMode');
      const currentThemeMode = localStorage.getItem('themeMode');
      if (currentThemeColor && currentThemeMode) {
        setCurrentColor(currentThemeColor);
        setCurrentMode(currentThemeMode);
      }
    }, []);
  

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
          <TooltipComponent
            content="Settings"
            position="Top"
          >
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>

          </TooltipComponent>
        </div>
       
        <div
          className={
            
               'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
            <Navbar />
          </div>
          <div>
            {themeSettings && (<ThemeSettings />)}
            {children}
          </div>
          <Footer />
        </div>
      </div>
  </div>
  );
};

export default OperatorLayout;
