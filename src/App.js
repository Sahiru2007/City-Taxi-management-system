import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Home from './pages/home';
import Signup from './pages/signup';
import OperatorSignup from './pages/operatorSignup'
import Login from './pages/login';
import UserType from './pages/userType';
import DriverSignUp from './pages/driverSignup';
import PassengerDashboard from './pages/PassengerDashboard/PassengerDashboard';
import PassengerDashboardLayout from './PassengerLayout';
import { AdminDashboard, Reservations, Drivers, Users, LiveLocation,GuestReservation, Reports, Payments } from './pages/AdminDashboard';
import ReserveTaxi from './pages/PassengerDashboard/ReserveTaxi';
import CurrentRide from './pages/PassengerDashboard/CurrentRide';
import TravelHistory from './pages/PassengerDashboard/TravelHistory';
import DriverDashboardLayout from './DriverLayout';
import DriverDashboard from './pages/DriverDashboard/DriverDashboard';
import Reservation from './pages/DriverDashboard/Reservations';
import DriverCurrrentRide from './pages/DriverDashboard/CurrentRide';
import Earning from './pages/DriverDashboard/Earning';
import OperatorReservation from './pages/Operator/reservation'
import { useUserType } from './UserTypeContext';
import OperatorLogin from './pages/operatorLogin'
import OperatorLayout from './OperatorLayout'


const App = () => {
  const userType = localStorage.getItem('userType');
  const isLoggedIn = localStorage.getItem('isLoggedIn'); 

  return (
    <BrowserRouter>
      <Routes>
         {/* Redirect to respective dashboard if logged in */}
         {isLoggedIn && (
          <Route
            path="/login"
            element={<Navigate to={`/${userType}/${userType}-dashboard`} replace />}
            
          />
          
          
        )}
        {isLoggedIn && (
          <Route
            path="/signup"
            element={<Navigate to={`/${userType}/${userType}-dashboard`} replace />}
            
          />
          
          
        )}
        {isLoggedIn && (
          <Route
            path="/driver_signup"
            element={<Navigate to={`/${userType}/${userType}-dashboard`} replace />}
            
          />
          
          
        )}
        <Route path="/" element={<Home />} />
        <Route path="/userType" element={<UserType />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/operator_login" element={<OperatorLogin />} />
        <Route path="/driver_signup" element={<DriverSignUp />} />
        <Route path="/operator_signup" element={<OperatorSignup />} />
        
        <Route
                path="/admin/*"
                element={
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/admin-dashboard" element={<AdminDashboard />} />
                      <Route path="/reservations" element={<Reservations />} />
                      <Route path="/passengers" element={<Users />} />
                      <Route path="/drivers" element={<Drivers />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/live-location" element={<LiveLocation />} />
                      <Route path="/guest-reservations" element={<GuestReservation />} />
                      <Route path="/reports" element={<Reports />} />
                      
                      {/* Add other admin routes here */}
                    </Routes>
                  </DashboardLayout>
                }
              />
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Private routes */}
        {isLoggedIn && (
          <>
            {userType === 'passenger' && (
              <Route
                path="/passenger/*"
                element={
                  <PassengerDashboardLayout>
                    <Routes>
                    <Route path="/" element={<PassengerDashboard />} />
                      <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
                      <Route path="/reserve-taxi" element={<ReserveTaxi />} />
                      <Route path="/current-ride" element={<CurrentRide />} />
                      <Route path="/my-travel-history" element={<TravelHistory />} />
                      {/* Add other passenger routes here */}
                    </Routes>
                  </PassengerDashboardLayout>
                }
              />
            )}

            {userType === 'driver' && (
              <Route
                path="/driver/*"
                element={
                  <DriverDashboardLayout>
                    <Routes>
                    <Route path="/" element={<DriverDashboard />} />
                      <Route path="/driver-dashboard" element={<DriverDashboard />} />
                      <Route path="/reservations" element={<Reservation />} />
                      <Route path="/current-ride" element={<DriverCurrrentRide />} />
                      {/* <Route path="/earning" element={<Earning />} /> */}
                      {/* Add other driver routes here */}
                    </Routes>
                  </DriverDashboardLayout>
                }
              />
            )}

        {userType === 'operator' && (
              <Route
                path="/operator/*"
                element={
                 <OperatorLayout>
                    <Routes>

                    <Route path="/" element={<OperatorReservation />} />
                      <Route path="/operatorReservation" element={<OperatorReservation/>} />
                      
                      {/* <Route path="/earning" element={<Earning />} /> */}
                      {/* Add other driver routes here */}
                    </Routes>
                    </OperatorLayout>
               
                }
              />
            )}

            {/* {userType === 'admin' && (
             
            )} */}

            {/* Unauthorized access handling */}
            <Route path="unauthorized" element={<UnauthorizedAccess />} />
            
            {/* Catch-all route for wrong URLs */}
            <Route path="*" element={<WrongURL />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

const UnauthorizedAccess = () => (
  <div>
    <h1>Unauthorized Access</h1>
    <p>You do not have permission to access this page.</p>
  </div>
);

const WrongURL = () => (
  <div>
    <h1>Wrong URL or not authorized</h1>
    <p>Please check the URL and make sure you have the correct permissions.</p>
  </div>
);

export default App;
