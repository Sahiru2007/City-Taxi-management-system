import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Button } from '.';
import { useStateContext } from '../../contexts/ContextProvider';
import avatar from '../../data/avatar.jpg';
import { useUserType } from '../../UserTypeContext'; 
const UserProfile = () => {
  const { currentColor } = useStateContext();
  const [userData, setUserData] = useState(null);
  const { setUserTypeContext } = useUserType();
  useEffect(() => {
 
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem('userData');

    // Parse the stored data as JSON
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  if (!userData) {
    // User data is still loading or not available
    return <div>Loading...</div>;
  }
  const handleLogout = () => {
    // Clear user-related data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem("userData");
    // Reset the user type in context
    setUserTypeContext(null);
  
    // Optionally, perform any additional logout logic, such as redirecting to the login page
    window.location = '/login';
  };
  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={userData.profilePic || avatar} // Use user's profile picture or default avatar

        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {userData.fullName || 'User'} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400"> {'Driver'} </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {userData.email || 'Email'} </p>
        </div>
      </div>
      <div>
      <div className="flex justify-end">
  <button
    style={{ backgroundColor: currentColor }}
    className="text-white w-full rounded-md mt-4 h-14"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>


      </div>
    </div>
  );
};

export default UserProfile;
