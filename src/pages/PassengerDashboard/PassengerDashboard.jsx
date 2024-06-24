import React, { useState, useEffect , useRef} from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, ColumnSeries, DataLabel } from '@syncfusion/ej2-react-charts';
import { MdOutlineCancel } from "react-icons/md";
import { Stacked, Pie, Button, LinkButton, LineChart, SparkLine } from '../../components/PassengerDashboard';
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
import { MdCardTravel } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { useUserType } from '../../UserTypeContext'; 
import {useJsApiLoader,GoogleMap, Marker, Autocomplete,  DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Skeleton } from '@mui/material';
import { printComplete } from '@syncfusion/ej2-react-grids';

const googleMapsLibraries = ['places'];
const PassengerDashboard = () => {
  const { setUserTypeContext } = useUserType(); 
  const [driverId, setDriverId] = useState(null);
  const { currentColor, currentMode } = useStateContext();
  const [userLocation, setUserLocation] = useState(null); // Correct usage of useState
  const [directions, setDirections] = useState(null);
  const google_api = "AIzaSyD20F4BQVuvR6RDNum0VzfHoO0W4u5UTH4"
  const [map, setMap] = useState(/** @type  google.maps.Map */(null));
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationId, setReservationId] = useState([]);
  const [time ,setTime] = useState([]);
  const [tripCount, setTripCount] = useState([]);
  const [totDistance, settotDistance] = useState([]);
  const [canceledCount, setcanceledCount] = useState([]);
  const directionsCallbackCalled = useRef(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api,
    libraries: googleMapsLibraries, // Use the constant here
  });
  useEffect(() => {


    const storedUserData = localStorage.getItem('userData');
    console.log(storedUserData)
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setDriverId(parsedUserData._id);
     
        const userId = parsedUserData._id;
      
    
        // Make an API request to get reservation requests for the driver
        fetch(`http://localhost:8080/api/passengerCurrentRide/${userId}`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Invalid response format');
            }
    
            const reservationData = await response.json();
            
            setReservations(reservationData);

            if (reservationData.length === 1) {
              const pickupCoordinates = reservationData[0].pickupCoordinates;
              setPickupCoordinates(pickupCoordinates);
              const destinationCoordinates = reservationData[0].destinationCoordinates;
              setDestinationCoordinates(destinationCoordinates);
              
              const reservationTime  = reservationData[0].time;
              setTime(reservationTime)
              // Log the coordinates to verify they are being retrieved correctly
              console.log('Pickup Coordinates:', pickupCoordinates);
              console.log('Destination Coordinates:', destinationCoordinates);
              setReservationId(reservationData[0]._id)
           
            }
          
           
    
    
          })
          .catch(error => {
            console.error('Error fetching requests:', error.message);
          });
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
      }
     
    }


     if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setDriverId(parsedUserData._id);
     
        const userId = parsedUserData._id;
      
    
        // Make an API request to get reservation requests for the driver
        fetch(`http://localhost:8080/api/passenger/dashboard/${userId}`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Invalid response format');
            }
    
            const dashboardData = await response.json();
            setTripCount(dashboardData.reservationCount);
            settotDistance(dashboardData.totalDistance);
            setcanceledCount(dashboardData.canceledCount);
            
            console.log(dashboardData)
          })
          .catch(error => {
            console.error('Error fetching requests:', error.message);
          });
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
      }
     
    }











    const fetchUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
  
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        
        // Fetch driver details from the backend after setting user location
       
      } catch (error) {
        console.error('Error getting user location:', error.message);
      }
    };
    fetchUserLocation();
   
  
  }, [])
  
  const earningData = [
    {
      icon: <MdCardTravel />,
      amount: tripCount,
      
      title: 'Total Trip Count',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <FaCarSide />,
      amount: totDistance + 'km',
      title: 'Total Distance Traveled',
      iconBg: 'rgb(255, 244, 229)',
      iconColor: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
   
    {
      icon: <SlCalender />,
      amount:  '3km', // Use the variable directly or fallback to 'No Reservations'
      title: 'Distance to nearest bus stop',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
    {
      icon: <MdOutlineCancel />,
      amount: canceledCount,
      title: 'Cancelled Buses',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
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
   const SparklineAreaData = [
    { x: 1, yval: 2 },
    { x: 2, yval: 6 },
    { x: 3, yval: 8 },
    { x: 4, yval: 5 },
    { x: 5, yval: 10 },
  
  ];
  const ecomPieChartData = [
    { x: '2018', y: 18, text: '35%' },
    { x: '2019', y: 18, text: '15%' },
    { x: '2020', y: 18, text: '25%' },
    { x: '2021', y: 18, text: '25%' },
  ];
 

  const weeklyStats = [
    {
      icon: <FiStar />,
      amount: '31',
      title: 'Johnathan Doe',
      iconBg: '#00C292',
      pcColor: 'green-600',
    },
    // Add other weeklyStats data
  ];

  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "purple",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2.5,
   
  };
 
  const svgMarkerDestination = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "green",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2.5,
   
  };
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
    <p className="font-bold text-gray-400">Bus</p>
    {reservations[0] ? (
  <p className="text-2xl">{reservations[0].driverName.split(' ')[0]}</p>
) : (
  <p>Next Bus: 05:35</p>
)}


  </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
             <FaCarSide />
            </button>
          </div>
          <div className="mt-6">
            <LinkButton
            to={'/passenger/Current-ride'}
              color="white"
              bgColor={currentColor}
              text="View Bus rides"
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

      <div className="flex gap-10 flex-wrap justify-center h-500">
       <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl  w-full ml-14 mr-14 h-300">
          <div className="flex justify-between rounded-2xl">
          <GoogleMap
            center={userLocation}
            zoom={13}
            mapContainerStyle={{ width: '100%', height: '50vh', borderRadius: '20px' }}
            options={{
              streetViewControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={userLocation}></Marker>
            {pickupCoordinates  && (
              <Marker
                position={pickupCoordinates}
                icon={svgMarker}
              ></Marker>
            )}
            {destinationCoordinates  && (
              <Marker
                position={destinationCoordinates}
                icon={svgMarkerDestination}
              ></Marker>
            )}

            {pickupCoordinates && destinationCoordinates && !directionsCallbackCalled.current && (
              <DirectionsService
                options={{
                  destination: destinationCoordinates,
                  origin: pickupCoordinates,
                  travelMode: 'DRIVING',
                }}
                callback={(response) => {
                  if (response !== null && response.status === 'OK') {
                    setDirections(response);
                    directionsCallbackCalled.current = true;
                  }
                }}
              />
            )}

            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
          </div>
        </div>

        
      </div>

     

      
    </div>
  );
};

export default PassengerDashboard;
