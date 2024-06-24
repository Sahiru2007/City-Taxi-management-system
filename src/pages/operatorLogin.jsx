import React, { useEffect } from 'react';

import './login.css';  
import { useState } from "react";
import axios from "axios";
import taxi from '../assets/taxi_2.jpeg';
import { useUserType } from '../UserTypeContext';

const Login = () => {
  const [data, setData] = useState({ email: "", password: ""});
  const [error, setError] = useState("");
  const { setUserTypeContext } = useUserType();
 

  const handleChange = ({ currentTarget: input }) => {
    if (input.name === 'type' && input.value === 'default') {
      // Skip setting the type when the default option is selected
      return;
    }

    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/operatorAuth";
      const { data: loginResponse } = await axios.post(url, data);
  
    
  
      // Set user type globally
      setUserTypeContext("type");
  
      // Set user details and login flag in local storage
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('userType', 'operator');
      localStorage.setItem("userData", JSON.stringify(loginResponse.data.userDetails));
  
      window.location = "/operator/";
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
    <div className='login-container'>
      <div className='image-container'>
        <img className='image' src={taxi} alt="Image" />
      </div>
      <div className='form-container'>
        <div className='header'>
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={handleSubmit}>
          <div className="input">
            <img src="" alt="" />
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
            />
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
            />
          </div>
          <div className="submit-container">
            <button className="mainbtn" type='submit'>Login</button>
            <div className="subbtn">Cancel</div>
          </div>
          {error && <div className='error' >{error}</div>}
          <div className="new-account-container">
            <div className="">Don't have an account?
              <a href="/operator_signup">Sign Up</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
