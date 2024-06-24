import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './userType.css'; // Make sure to create or import your CSS file
import driver from '../assets/driver.png';
import passenger from '../assets/passenger.png';

const UserTypeSelector = () => {
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Select an user type<span className="underline"></span></h1>
      <div className="user-type-selector">
        <div
          className={`user-card ${selectedUserType === 'driver' ? 'selected' : ''}`}
          onClick={() => handleUserTypeSelect('driver')}
        >
          <img src={driver} alt="Driver" className="user-image" />
          <div className="user-info">
            <h2>Driver</h2>
            <p>Experienced drivers ready to take you to your destination. </p>
          </div>
        </div>

        <div
          className={`user-card ${selectedUserType === 'passenger' ? 'selected' : ''}`}
          onClick={() => handleUserTypeSelect('passenger')}
        >
          <img src={passenger} alt="Passenger" className="user-image" />
          <div className="user-info">
            <h2>Passenger</h2>
            <p>Relax and enjoy the journey as a passenger with our reliable drivers. </p>
          </div>
        </div>
      </div>

      <Link
        to={selectedUserType === 'driver' ? '/driver_signup' : '/signup'}
        className="choose-button"
      >
        Choose
      </Link>
    </div>
  );
};

export default UserTypeSelector;
