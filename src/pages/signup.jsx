// Signup.jsx
import React from 'react';
import './signup.css';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import taxi from '../assets/bus.jpeg';

const Signup = () => {
  const [data, setData] = useState({
    fullName: "",         // Full Name
    gender: "",           // Gender
    dateOfBirth: "",       // Date of Birth
    NIC: "",               // NIC
    email: "",             // Email
    contactNumber: "",     // Contact Number
    homeAddress: "",       // Home Address
    city: "",              // City
    postalCode: "",        // Postal Code

    password: "",          // Password
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [image , setImage] = useState()
  const handleChange = ({currentTarget:input}) =>{
    setData({ ...data,[input.name]: input.value});
  };
  const onInputChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/passenger/";
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
    <div className='signup-container'>
      <div className='image-container'>
        <img className='image' src={taxi} alt="Image" />
      </div>
     
      <form className='form-container' onSubmit={handleSubmit}>
        <div className='header'>
          <div className="text">Sign Up</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src="" alt="" />
            <label>Full Name</label>
            <input type="text"
            name='fullName'
            value={data.fullName}
            required
            onChange={handleChange}
             />
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>Date Of Birth</label>
            <input type="date"
            name='dateOfBirth'
            value={data.dateOfBirth}
            required
            onChange={handleChange}
             />
          </div>
          <div className="input">
            <label>Gender</label>
            <div className="gender-options">
            <input type="radio" id="male" name="gender" 
            onChange={handleChange}
            checked={data.gender === "male"}
            value="male"/>
  <label for="male">Male</label>

  <input type="radio" id="female" name="gender"
    onChange={handleChange}
    checked={data.gender === "female"} value="female"/>
  <label for="female">Female</label>
            </div>
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>NIC</label>
            <input type="text" name='NIC'
            value={data.NICh}
            required
            onChange={handleChange}/>
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>Email Address</label>
            <input type="email" name='email'
            value={data.email}
            required
            onChange={handleChange}/>
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>Contact Number</label>
            <input type="tel" name='contactNumber'
            value={data.contactNumber}
            required
            onChange={handleChange}/>
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>Home Address</label>
            <input type="text" name='homeAddress'
            value={data.homeAddress}
            required
            onChange={handleChange}/>
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>City</label>
            <input type="text"
            name='city'
            value={data.city}
            required
            onChange={handleChange} />
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>Postal Code</label>
            <input type="text" 
            name='postalCode'
            value={data.postalCode}
            required
            onChange={handleChange}/>
          </div>
        
          <div className="input">
            <img src="" alt="" />
            <label>Password</label>
            <input type="password" 
            name='password'
            value={data.password}
            required
            onChange={handleChange}/>
          </div>
          <div className="input">
            <img src="" alt="" />
            <label>Confirm Password</label>
            <input type="password" />
          </div>
        
        </div>
        {error && <div className='error'>{error}</div>}
        <div className="submit-container">
          <button className="mainbtn" type='submit'>Sign up</button>
          <div className="subbtn">Cancel</div>
        </div>
        <div className="already-container">
          <div className="">Already have an account?
          <a href="/login">Login</a></div>
        </div>

      </form>
    </div>
  );
};

export default Signup;
