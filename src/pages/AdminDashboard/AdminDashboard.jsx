import React, {useEffect, useRef, useState} from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, ColumnSeries, DataLabel } from '@syncfusion/ej2-react-charts';
import { MdOutlineCancel } from "react-icons/md";
import { Stacked, Pie, Button, LineChart, SparkLine } from '../../components/PassengerDashboard';
import { useStateContext } from '../../contexts/ContextProvider';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsBoxSeam, BsShield, BsChatLeft } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { GiLouvrePyramid } from 'react-icons/gi';
import { GrLocation } from 'react-icons/gr';
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { CiCirclePlus } from "react-icons/ci";
import {useJsApiLoader,GoogleMap, Marker, Autocomplete} from '@react-google-maps/api'
import { FaTaxi } from "react-icons/fa6"



import { Skeleton } from '@mui/material'
const dropdownData = [
  {
    Id: '1',
    Time: 'March 2021',
  },
  {
    Id: '2',
    Time: 'April 2021',
  }, {
    Id: '3',
    Time: 'May 2021',
  },
];
const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);
const libraries = ['places']; 
const AdminDashboard = () => {
  const [canceledReservationCount, setCanceledReservationCount] = useState([]);
  const [passengerCount, setPassengerCount] = useState([]);
  const [reservationCount, setReservationCount] = useState([]);
  const [todayReservationsCount, setTodayReservationCount] = useState([]);
  const [driverDetails, setDriverDetails] = useState([])
  const [totalEarning, setTotalEarning] = useState([]);
  const [vehicleStats, setVehicleStats] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);
  const [topPassengers, setTopPassengers] = useState([]);
  const { currentColor, currentMode } = useStateContext();
  const [map, setMap] = useState(/** @type  google.maps.Map */ (null));
    const google_api = "Google_API_KEY"
 
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api,
    libraries: libraries, // Pass libraries from the constant
  });
  const earningData = [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: passengerCount,
      title: 'Passengers',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <SlCalender />,
      amount: reservationCount,
      title: 'Reservations',
      iconBg: 'rgb(255, 244, 229)',
      iconColor: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <MdOutlineCancel />,
      amount: canceledReservationCount,
      title: 'Cancelled Reservations',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
    },
    {
      icon: <CiCirclePlus />,
      amount: todayReservationsCount,
      title: "Today's reservations",
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
  ];

  const recentTransactions = [
    {
      icon: <BsCurrencyDollar />,
      amount: '+$350',
      title: 'Paypal Transfer',
      desc: 'Money Added',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'green-600',
    },
    // Add other recentTransactions data
  ];
  const monthToNumber = {
    Jan: 1,
    Feb: 2,
    // ... (add mappings for other months)
  };
  
  const SparklineAreaData = [
    { x: monthToNumber['Jan'], yval: 100, text: 'January' },
    { x: monthToNumber['Feb'], yval: 150, text: 'February' },
  ];
  
  const ecomPieChartData = [
    { x: '2018', y: 18, text: '35%' },
    { x: '2019', y: 18, text: '15%' },
    { x: '2020', y: 18, text: '25%' },
    { x: '2021', y: 18, text: '25%' },
  ];
 

  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "orange",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,

 };
  useEffect(() => { 

      try {

        fetch(`http://localhost:8080/api/adminDashboard`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Invalid response format');
            }
    
            const dashboardData = await response.json();
          setTotalEarning(dashboardData.totalEarning)
          setReservationCount(dashboardData.reservationCount)
          setCanceledReservationCount(dashboardData.cancelledReservationsCount)
          setPassengerCount(dashboardData.passengerCount)
          setTodayReservationCount(dashboardData.todayReservationsCount)
          setTopDrivers(dashboardData.topDrivers)
          setTopPassengers(dashboardData.topPassengers)
          setVehicleStats(dashboardData.vehicleTypeStats)
         
          })
          .catch(error => {
            console.error('Error fetching requests:', error.message);
          });
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
      }
       // Fetch driver details from the backend
     const fetchDriverDetails = async () => {
    
      try {
        const response = await fetch('http://localhost:8080/api/adminDashboard/getDriverDetails');
        const data = await response.json();

        
        console.log(data)
        setDriverDetails(data);
      } catch (error) {
        console.error('Error fetching and filtering driver details:', error.message);
      }
    };
     fetchDriverDetails();
    
   }, 
   []);
   const vehicleStatsData = vehicleStats.map((item) => ({
    x: item.vehicleType,
    y: item.count,
    text: `${item.percentage.toFixed(2)}%`,
  }));
   if (!isLoaded) {
    return (
      // Your loading spinner or placeholder JSX here
      <Skeleton  />
    );
  } 
  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl">Rs. {totalEarning}</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <BsCurrencyDollar />
            </button>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Payment"
              borderRadius="10px"
            />
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {earningData.map((item) => (
            <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="flex gap-10 flex-wrap justify-center">
       <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl  w-1200">
          <div className="flex justify-between">
          <GoogleMap
 center={{ lat: 7.2906, lng: 80.6337 }}
  zoom={13}
  mapContainerStyle={{ width: '100%', height: '50vh', borderRadius: '20px' }}
  options={{
    streetViewControl: false,
    fullscreenControl: false,
  }}
  onLoad={(map) => setMap(map)}
>
  {driverDetails.map((driver) => (
    <Marker
    key={driver.DriverID}
    position={{ lat: driver.latitude, lng: driver.longitude }}
   icon={svgMarker}
   label={{ color: 'Black', fontWeight: 'bold', fontSize: '14px', marginBottom:'10px', text: driver.fullName} }

    >
      <div style={{ background: 'white', padding: '5px', borderRadius: '5px', fontWeight: 'bold' }}>
        {driver.fullName}
      </div>
    </Marker>
  
  ))}
</GoogleMap>
          </div>
        </div>

      
      </div>


      <div className="flex flex-wrap justify-center">
        <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Weekly Driver Leaderboard</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>
          <div className="mt-10 ">
          {topDrivers.map((driver) => (
              <div key={driver._id} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{ background: "#00C292"}}
                    className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  >
                 <FiStar />
                  </button>
                  <div>
                  <p className="text-md font-semibold">{driver.fullName.split(' ')[0]}</p>

                    <p className="text-sm text-gray-400"></p>
                  </div>
                </div>
                <p className="green-600">{driver.averageRating}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Weekly Passenger Leaderboard</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>
          <div className="mt-10 ">
          {topPassengers.map((passenger) => (
              <div key={passenger._id} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{background: "#00C292"}}
                    className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  >
                        <FiStar />
                  </button>
                  <div>
                    <p className="text-md font-semibold">{passenger.fullName.split(' ')[0]}</p>
                    
                  </div>
                </div>
                <p className="green-600">{passenger.reservationCount}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div>
            <p className="text-gray-400">Popular vehicle Types</p>
          </div>
          <div className="w-100">
          <Pie id="vehicle-chart" data={vehicleStatsData} legendVisiblity={false} height="250px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
