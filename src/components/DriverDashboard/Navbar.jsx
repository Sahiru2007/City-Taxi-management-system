import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../../data/avatar.jpg';
import { Notification, UserProfile } from '.';
import { useStateContext } from '../../contexts/ContextProvider';
import { useUserType } from '../../UserTypeContext';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();
  const [userData, setUserData] = useState(null);
  const [userStatus, setUserStatus] = useState('Available');

  const { setUserTypeContext } = useUserType();

  const getUserStatusFromDatabase = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');

      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);

        const userId = parsedUserData._id;

        const response = await fetch(`http://localhost:8080/api/driverStatus/getUserStatus/${userId}`);
        const responseData = await response.json();
        console.log(responseData);
        setUserStatus(responseData.status);
        
      }
    } catch (error) {
      console.error('Error fetching user status:', error.message);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }

    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();

    getUserStatusFromDatabase();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const handleToggleUserStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/driverStatus/updateUserStatus/${userData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: userStatus === 'Available' ? 'Busy' : 'Available',
        }),
      });

      if (response.ok) {
        setUserStatus((prevStatus) => (prevStatus === 'Available' ? 'Busy' : 'Available'));
      } else {
        console.error('Failed to update user status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user status:', error.message);
    }
  };

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />

      <div className="flex">
        <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-full">
          <button
            type="button"
            onClick={handleToggleUserStatus}
            className="relative text-xl rounded-full p-3 hover:bg-light-gray transition duration-300 ease-in-out"
          >
            <span
              style={{ background: userStatus === 'Busy' ? 'red' : 'green' }}
              className="absolute inline-flex rounded-full h-5 w-5 right-1 top-0.5"
            />
          </button>
          <p className="text-gray-400 font-bold text-sm">{userStatus}</p>
        </div>

       

        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <img className="rounded-full w-8 h-8" src={avatar} alt="user-profile" />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{' '}
              <span className="text-gray-400 font-bold ml-1 text-14">{userData.fullName || 'User'}</span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>

        {isClicked.cart && <Cart />}
        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
