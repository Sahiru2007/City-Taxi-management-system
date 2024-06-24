import React, { useState, useEffect , useRef} from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import axios from 'axios';
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
import { FaRegStar } from "react-icons/fa";
import { useUserType } from '../../UserTypeContext'; 
import {useJsApiLoader,GoogleMap, Marker, Autocomplete,  DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Skeleton } from '@mui/material';
const googleMapsLibraries = ['places'];
const DriverDashboard = () => {
  const { currentColor, currentMode } = useStateContext();
  const [userLocation, setUserLocation] = useState(null); // Correct usage of useState
  const { setUserTypeContext } = useUserType(); 
  
  const [driverId, setDriverId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [directions, setDirections] = useState(null);
  const google_api = "AIzaSyD20F4BQVuvR6RDNum0VzfHoO0W4u5UTH4"
  const [map, setMap] = useState(/** @type  google.maps.Map */(null));
   const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api,
    libraries: googleMapsLibraries, // Use the constant here
  });

  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationCount, setreservationCount] = useState([]);
  const [totDistance, settotDistance] = useState([]);
  const [reservationtime, setreservationtime]  = useState([]);
  const [reservationId, setReservationId] = useState([]);
  const [oneLocation, setOneLocation] = useState(null);
  const [rating, setRating] = useState([]);
  const directionsCallbackCalled = useRef(false);


  useEffect(() => {

    const fetchUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
  
        const { latitude, longitude } = position.coords;
        setOneLocation({ lat: latitude, lng: longitude });

    
      } catch (error) {
        console.error('Error getting user location:', error.message);
      }
    };
    fetchUserLocation();
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setDriverId(parsedUserData._id);
    
        const userId = parsedUserData._id;
    
        // Make an API request to get reservation requests for the driver
        fetch(`http://localhost:8080/api/reservationRequests/${userId}`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Invalid response format');
            }
    
            const requestData = await response.json();
            setRequests(requestData);
            
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
        fetch(`http://localhost:8080/api/driver/dashboard/${userId}`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Invalid response format');
            }
    
            const dashboardData = await response.json();
            setreservationCount(dashboardData.reservationCount);
            settotDistance(dashboardData.totalDistance)
            setreservationtime(dashboardData.time);
            setRating(dashboardData.averageRating);

          })
          .catch(error => {
            console.error('Error fetching requests:', error.message);
          });
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
      }
     
    }

    
   

    const fetchData = async () => {
      
      try {
        const storedUserData = localStorage.getItem('userData');
    
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setDriverId(parsedUserData._id);
    
          const userId = parsedUserData._id;
    
          // Make an API request to get the driver's location
          const locationResponse = await fetch(`http://localhost:8080/api/location/getUserLocation/${userId}`);
          
          // Check if the response is valid JSON
          if (!locationResponse.ok || !locationResponse.headers.get('content-type')?.includes('application/json')) {
            throw new Error('Invalid response format');
          }
    
          const locationData = await locationResponse.json();
    
          // Assuming you have setUserLocation function to update the location state
          setUserLocation([locationData.latitude, locationData.longitude]);

          // Start fetching and sending location every 30 seconds
          const locationInterval = setInterval(fetchAndSendLocation, 30000);
    
          // Clear the interval when the component unmounts
          return () => clearInterval(locationInterval);
        }
      } catch (error) {
        console.error('Error fetching user location:', error.message);
      }
    };
    
    fetchData();
  }, []);

  // Inside the component where you want to send the location update

const fetchAndSendLocation = async () => {
  try {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setDriverId(parsedUserData._id);

      const userId = parsedUserData._id;

      // Fetch the current location using the Geolocation API
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Make a POST request to update the user location
          const response = await fetch(`http://localhost:8080/api/location/updateUserLocation/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude,
              longitude,
            }),
          });

          if (response.ok) {
            console.log('Location updated successfully');
          } else {
            console.error('Failed to update location:', response.statusText);
          }
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        }
      );
    }
  } catch (error) {
    console.error('Error updating user location:', error.message);
  }
};

// Start fetching and sending location every 30 seconds
const locationInterval = setInterval(fetchAndSendLocation, 30000);


useEffect(() => {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setDriverId(parsedUserData._id);
   
      const userId = parsedUserData._id;
    
  
      // Make an API request to get reservation requests for the driver
      fetch(`http://localhost:8080/api/driverCurrentRide/${userId}`)
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
 
}, [requests]); // useEffect to log requests when it changes

  const earningData = [
    {
      icon: <MdCardTravel />,
      amount: reservationCount,
      
      title: 'No of Trips',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <FaCarSide />,
      amount: totDistance + "km",
      title: 'Total Distance Drived',
      iconBg: 'rgb(255, 244, 229)',
      iconColor: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
   
    {
      icon: <SlCalender />,
      amount: reservationtime || 'No Reservations', 
      title: 'Next Hire',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
    {
      icon: <FaRegStar />,
      amount: rating,
      title: 'Average rating',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
    },
  ];

   

 
 
  const handleAccept = async (reservationId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/reservationRequests/changeStatus/${reservationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'OnGoing',
            }),
        });

        if (response.ok) {
            console.log("Reservation status updated successfully");

            // Remove the accepted reservation from the state
            setRequests((prevRequests) => prevRequests.filter(request => request._id !== reservationId));
        } else {
            const errorData = await response.json();
            setError(errorData.message);
            console.error('Failed to update reservation status:', errorData.message);
        }
    } catch (error) {
        setError('Error updating reservation status');
        console.error('Error updating reservation status:', error.message);
    }
};
  const handleDecline = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservationRequests/changeStatus/${reservationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Declined',
        }),
      });
  
      if (response.ok) {
        console.log("Reservation status updated successfully");
  
        // Remove the accepted reservation from the state
        setRequests((prevRequests) => prevRequests.filter(request => request._id !== reservationId));
      } else {
        console.error('Failed to update reservation status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating reservation status:', error.message);
    }
  };
  
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
              <p className="font-bold text-gray-400">Current Passenger</p>
              {reservations[0] ? (
  <p className="text-2xl">{reservations[0].passengerName.split(' ')[0]}</p>
) : (
  <p>No reservations</p>
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
              text="View Current Ride"
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
      <div className="flex gap-10 m-4 flex-wrap justify-center">
  <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-1200 max-h-[384px] overflow-y-auto">
    <div className="flex justify-between items-center gap-2">
      <p className="text-xl font-semibold">Reservation Requests</p>
    </div>

    <div className="table-container">
    {error && <div id="error" className="text-red-400">{error}</div>}
      <table className="w-full mt-6">
        <thead>
          <tr>
        
            <th className="text-left px-5 py-2">Passenger Name</th>
            <th className="text-left px-5 py-2">PickUp location</th>
            <th className="text-left px-5 py-2">Destination</th>
            <th className="text-left px-5 py-2">Time</th>
            <th className="text-left px-5 py-2">est. Distance</th>
            <th className="text-left px-5 py-2">est. Duration</th>
            <th className="text-left px-5 py-2">Contact</th>
            <th className="text-left px-5 py-2">Total Payment</th>
            <th className="text-left px-5 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto max-h-[300px]">
  {requests.map((request, index) => (
    <tr key={request._idId} className={index === 0 ? '' : 'border-none'}>
      <td className="px-5 py-4"  hidden>{request._id}</td>
      <td className="px-5 py-4">{request.passengerName}</td>
      <td className="px-5 py-2">{request.pickupLocation}</td>
      <td className="px-5 py-2">{request.destination}</td>
      <td className="px-5 py-2">{request.time}</td>
      <td className="px-5 py-2">{request.distance}</td>
      <td className="px-5 py-2">{request.duration}</td>
      <td className="px-5 py-2">{request.passengerContactNumber}</td>
      <td className="px-5 py-2">{request.totalPayment}</td>
      <td className="flex items-center gap-2">
        {/* Add buttons for accepting or declining */}
        <button
          type="button"
          className="flex items-center text-green-600 px-3 py-2 bg-green-100 rounded-full opacity-70 hover:opacity-100"
          onClick={() => handleAccept(request._id)}
        >
          <CiCirclePlus size={16} className="mr-1" />
          Accept
        </button>
        <button
          type="button"
          className="flex items-center text-red-600 px-3 py-2 bg-red-100 rounded-full opacity-70 hover:opacity-100"
          onClick={() => handleDecline(request._id)}
        >
          <MdOutlineCancel size={16} className="mr-1" />
          Decline
        </button>
      </td>
    </tr>
  ))}
</tbody>

    </table>
    <div className="flex justify-between items-center mt-5 border-t-1 border-color">
      <div className="mt-3">
        <LinkButton
          to={'/passenger/My-Travel-History'}
          color="white"
          bgColor={currentColor}
          text="View all Reservations"
          borderRadius="10px"
        />
      </div>
    </div>
  </div>
</div>
</div>

      <div className="flex gap-10 flex-wrap justify-center">
       <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl  w-1200">
          <div className="flex justify-between rounded-2xl">
          <GoogleMap
            center={oneLocation}
            zoom={13}
            mapContainerStyle={{ width: '100%', height: '50vh', borderRadius: '20px' }}
            options={{
              streetViewControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            {oneLocation &&(
              <Marker position={oneLocation}></Marker>
            )
               }
          
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

export default DriverDashboard;
