import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { FiShoppingBag } from 'react-icons/fi';
import { SlCalender } from 'react-icons/sl';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine } from 'react-icons/ri';
import { CiLocationOn } from 'react-icons/ci';
import { LuMonitor } from "react-icons/lu";
import { useStateContext } from '../../contexts/ContextProvider';
import arrow from '../../data/navigation.png';
import { FaCarSide } from "react-icons/fa";
import { CiMoneyBill } from "react-icons/ci";
const links = [
  {
    title: 'Dashboard',
    links: [
      {
        name: 'driver dashboard',
        icon: <LuMonitor />
      },
    ],
  },
  {
    title: 'Operations',
    links: [
      {
        name: 'Reservations',
        icon: <SlCalender />,
      },
      {
        name: 'Current Ride',
        icon: <FaCarSide />,
      },
     
    ],
  },
];

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const formatLinkName = (name) => {
    // Replace spaces with dashes or any other desired format
    return name.replace(/\s+/g, '-');
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-0 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              CITY T   <img src={arrow} alt="Arrow" style={{ width: '18px', height: '18px' }} /> XI
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/driver/${formatLinkName(link.name)}`}  
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
