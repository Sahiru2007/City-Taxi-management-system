import React, { useState } from 'react';
import './driverSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import taxi from '../assets/taxi_3.jpeg';
import profile_image from '../assets/profile-user.png';

const DriverSignup = () => {
  const [data, setData] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    NIC: "",
    contactNumber: "",
    homeAddress: "",
    city: "",
    driverLicenseNumber: "",
    licenseExpiryDate: "",
    vehicleType: "",
    vehicleRegistrationNumber: "",
    vehicleModel: "",
    vehicleMake: "",

    password: "",

  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/driver/";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className='driverSignup-container'>
      <div className='image-container'>
        <img className='image' src={taxi} alt="City Taxi" />
      </div>
      <div className='form-container'>
        <div className='header'>
          <div className="text">Sign Up as a driver</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <label htmlFor="full-name">Full Name</label>
            <input
              type="text"
              id="full-name"
              name="fullName"
              value={data.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="dob">Date Of Birth</label>
            <input
              type="date"
              id="dob"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="nic">NIC</label>
            <input
              type="text"
              id="nic"
              name="NIC"
              value={data.NIC}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="contact-number">Contact Number</label>
            <input
              type="tel"
              id="contact-number"
              name="contactNumber"
              value={data.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="home-address">Home Address</label>
            <input
              type="text"
              id="home-address"
              name="homeAddress"
              value={data.homeAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={data.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="license-number">Driver License Number</label>
            <input
              type="text"
              id="license-number"
              name="driverLicenseNumber"
              value={data.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="license-expiry">License Expiry Date</label>
            <input
              type="date"
              id="license-expiry"
              name="licenseExpiryDate"
              value={data.licenseExpiryDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="vehicle-type">Vehicle Type</label>
            <select
  id="vehicle-type"
  className='input'
  name="vehicleType"
  value={data.vehicleType}
  onChange={handleChange}
  required
  
>
  <option value="" selected disabled>Select Vehicle Type</option>
  <option value="Car">Car</option>
  <option value="Van">Van</option>
  <option value="Motorbike">Motorbike</option>
  <option value="Three-Wheeler">Three-Wheeler</option>
  <option value="Cab">Cab</option>
  <option value="Truck">Truck</option>
  <option value="Other">Other</option>

</select>
          </div>
          <div className="input">
            <label htmlFor="vehicle-registration">Vehicle Registration Number</label>
            <input
              type="text"
              id="vehicle-registration"
              name="vehicleRegistrationNumber"
              value={data.vehicleRegistrationNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="vehicle-model">Vehicle Model</label>
            <input
              type="text"
              id="vehicle-model"
              name="vehicleModel"
              value={data.vehicleModel}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="vehicle-make">Vehicle Make</label>
            <input
              type="text"
              id="vehicle-make"
              name="vehicleMake"
              value={data.vehicleMake}
              onChange={handleChange}
              required
            />
          </div>
    
          <div className="input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
         
        </div>
        {error && <div className='error'>{error}</div>}
        <div className="submit-container">
          <button className="mainbtn" type='submit' onClick={handleSubmit}>
            Sign up
          </button>
          <div className="subbtn">Cancel</div>
        </div>
        <div className="already-container">
          <div className="">Already have an account?
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSignup;
