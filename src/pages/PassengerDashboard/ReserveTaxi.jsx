import React, { useState, useEffect, useRef } from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import 'leaflet/dist/leaflet.css';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, ColumnSeries, DataLabel } from '@syncfusion/ej2-react-charts';
import { MdOutlineCancel } from "react-icons/md";
import { Stacked, Pie, Button, LineChart, SparkLine } from '../../components/PassengerDashboard';
import { useStateContext } from '../../contexts/ContextProvider';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Page, Toolbar } from '@syncfusion/ej2-react-grids';
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
import { IoNavigate } from "react-icons/io5";
import {useJsApiLoader,GoogleMap, Marker, Autocomplete} from '@react-google-maps/api'
import { FaTaxi } from "react-icons/fa6"



import { Skeleton } from '@mui/material';
const googleMapsLibraries = ['places'];
const ReserveTaxi = () => {
  const google_api = "AIzaSyD20F4BQVuvR6RDNum0VzfHoO0W4u5UTH4"
  const { currentColor, currentMode } = useStateContext();
  const [userLocation, setUserLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [directionResponse, setdirectionResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState(null);
  const [map, setMap] = useState(/** @type  google.maps.Map */ (null));
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [driverDetails, setDriverDetails] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api,
    libraries: googleMapsLibraries, // Use the constant here
  });
  
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [autocompletePickup, setAutocompletePickup] = useState(null);
  const [autocompleteDestination, setAutocompleteDestination] = useState(null);

   /** @type React.MutableRefObject<HTMLInputElement> */
   const originRef = useRef()
   /** @type React.MutableRefObject<HTMLInputElement> */
   const destiantionRef = useRef()


  const onPickupPlaceSelected = (place) => {
    if (place && place.geometry && place.geometry.location) {
      setPickupLocation({
        formatted_address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      console.error('Invalid pickup location:', place);
      // Handle the error or provide user feedback as needed
    }
  };
  
  const onDestinationPlaceSelected = (place) => {
    if (place && place.geometry && place.geometry.location) {
      setDestination({
        formatted_address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      console.error('Invalid destination:', place);
      // Handle the error or provide user feedback as needed
    }
  };
  


  useEffect(() => {

    
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
  const storedUserData = localStorage.getItem('userData');

    // Parse the stored data as JSON
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers
      return distance;
    };
    fetchUserLocation();
     // Fetch driver details from the backend
     const fetchDriverDetails = async () => {
    
      try {
        const response = await fetch('http://localhost:8080/api/driver/getDriverDetails');
        const data = await response.json();

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
  
        const { latitude, longitude } = position.coords;
        // Assuming `userLocation` is an object with `lat` and `lng` properties
        const userLat = latitude;
        const userLng = longitude;
  
        // Filter drivers based on a distance threshold (e.g., 15 km)
        const filteredDrivers = data.filter((driver) => {
          const driverLat = driver.latitude;
          const driverLng = driver.longitude;
          const distance = calculateDistance(userLat, userLng, driverLat, driverLng);
          return distance <= 40; // Adjust the distance threshold as needed
        });
  
        setDriverDetails(filteredDrivers);
        console.log(filteredDrivers)
      } catch (error) {
        console.error('Error fetching and filtering driver details:', error.message);
      }
    };
     fetchDriverDetails();

  }, []);
  
  
  function calculatePayment(vehicleType, distance, duration) {
  // Vehicle Factors
  const vehicleFactors = {
    Car: 1.0,
    Van: 1.2,
    Motorbike: 0.8,
    'Three-Wheeler': 0.8,
    Cab: 1.4,
    Truck: 1.8,
    Other: 1.1 // Adjust as needed
  };

  // Base Fare (Sri Lankan Rupees)
  const baseFares = {
    Car: 120,
    Van: 144,
    Motorbike: 96,
    'Three-Wheeler': 72,
    Cab: 168,
    Truck: 216,
    Other: 132 // Adjust as needed
  };

  // Distance Rate (Sri Lankan Rupees per kilometer)
  const distanceRate = 80;

  // Duration Rate (Sri Lankan Rupees per minute)
  const durationRate = 4;

  // Validate vehicle type
  if (!(vehicleType in vehicleFactors) || !(vehicleType in baseFares)) {
    throw new Error('Invalid vehicle type');
  }

  // Convert distance and duration to numbers
  const parsedDistance = parseFloat(distance);
  const parsedDuration = parseFloat(duration)/60;

  // Validate distance and duration
  if (isNaN(parsedDistance) || isNaN(parsedDuration)) {
    throw new Error('Invalid distance or duration');
  }

   let totalAmount =
    baseFares[vehicleType] * vehicleFactors[vehicleType] +
    distanceRate * parsedDistance +
    durationRate * parsedDuration

   totalAmount = totalAmount.toFixed(2);

  return totalAmount;
}
  
 
  const handleBook = async () => {
    const selectedTime = document.getElementById('timeInput').value;
    try {
      if (!selectedDriver || !pickupLocation || !destination || !selectedTime) {
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
          errorDiv.innerHTML = 'Please select a driver, pickup location, destination, and the time';
        }
        console.error('Please select a driver, pickup location, destination, and the time');
        return;
      }
  
      if (!pickupLocation.lat || !pickupLocation.lng || !destination.lat || !destination.lng) {
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
          errorDiv.innerHTML = 'Invalid pickup location or destination: ' + JSON.stringify({ pickupLocation, destination });
        }
        console.error('Invalid pickup location or destination:', pickupLocation, destination);
        // Handle the error or provide user feedback as needed
        return;
      }
      const errorDiv = document.getElementById('error');
if (errorDiv) {
  errorDiv.innerHTML = '';
}
      
      const directionService = new google.maps.DirectionsService()
      const results = await directionService.route({
        origin: originRef.current.value,
        destination: destiantionRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      setdirectionResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.value)
      const vehicleType = selectedDriver.vehicleType;
       // Extract time from the time input field

       const totalPayment = calculatePayment(vehicleType, results.routes[0].legs[0].distance.text, results.routes[0].legs[0].duration.value);
       const currentDate = new Date();
       const formattedDate = currentDate.toISOString().split('T')[0];
      // Include the selected driver's details, including _id, in the booking request
      const bookingData = {
        driverId: selectedDriver._id,
        driverName: selectedDriver.fullName,
        driverContactNumber :selectedDriver.contactNumber,
        vehicleType : selectedDriver.vehicleType,
        vehicleMake : selectedDriver.vehicleMake,
        vehicleModel : selectedDriver.vehicleModel,
        vehicleRegistrationNumber : selectedDriver.vehicleRegistrationNumber,
        passengerId: userData._id,
        passengerName: userData.fullName,
        passengerContactNumber: userData.contactNumber,
        pickupLocation: pickupLocation.formatted_address,
        pickupCoordinates: { lat: pickupLocation.lat, lng: pickupLocation.lng },
        destination: destination.formatted_address,
        destinationCoordinates: { lat: destination.lat, lng: destination.lng },
        distance: results.routes[0].legs[0].distance.text,
        duration: results.routes[0].legs[0].duration.text,
        time: selectedTime,
        date: formattedDate,
        status: "Requested",
        totalPayment: totalPayment,
      };
  
      // Log the extracted details for debugging
      console.log('Booking Details:', bookingData);
  
      // Send the booking request to the backend
      const response = await fetch('http://localhost:8080/api/reservation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
  
     
    if (response.ok) {
      console.log('Booking successful');
      // Change the class of the success div to "text-green-400"
      const errorDiv = document.getElementById('error');
      if (errorDiv) {
        errorDiv.classList.remove('text-red-400');
        errorDiv.classList.add('text-green-400');
        errorDiv.innerHTML = `Booking Request has been sent!<br>Pickup Location: ${pickupLocation.formatted_address}<br>Destination: ${destination.formatted_address}<br>Estimated Distance: ${results.routes[0].legs[0].distance.text}<br>Estimated Duration: ${results.routes[0].legs[0].duration.text}<br> Total Amount: Rs.${totalPayment}`;
      }
      // Additional logic if needed after a successful booking
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        console.error('Failed to update reservation status:', errorData.message);
        // Additional error handling logic
      }
    } catch (error) {
      console.error('Error booking:', error.message);
      // Additional error handling logic
    }
  };
  
  
  if (!isLoaded) {
    return (
      // Your loading spinner or placeholder JSX here
      <Skeleton  />
    );
  } 
  async function calculateRoute(){
    if(originRef.current.value === '' || destiantionRef.current.value === ''){
      return
    }
    const directionService = new google.maps.DirectionsService()
    const results = await directionService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setdirectionResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0], legs[0],duration.text)


  }
  

  const svgMarker = {
    path: "M34.313,250.891c2.297-5.016,6.688-13.281,14.438-27.813c3.531-6.672,7.5-14.047,11.563-21.625H24.719C11.063,201.453,0,212.516,0,226.188c0,13.641,11.063,24.703,24.719,24.703H34.313z M487.281,201.453h-35.594c4.078,7.578,8.031,14.953,11.563,21.625c7.75,14.531,12.125,22.797,14.438,27.813 h9.594c13.656,0,24.719-11.063,24.719-24.703C512,212.516,500.938,201.453,487.281,201.453z M39.391,465.188c0,18.406,14.938,33.328,33.328,33.328c18.406,0,33.313-14.922,33.313-33.328v-31.516H39.391V465.188z M405.938,465.188c0,18.406,14.938,33.328,33.344,33.328s33.328-14.922,33.328-33.328v-31.516h-66.672V465.188z M467.875,257.109c1.688,0.484-61.688-115.828-64.719-122.109c-8-16.672-27.781-26.703-47.063-26.703 c-22.281,0-84.344,0-84.344,0s-93.563,0-115.859,0c-19.297,0-39.031,10.031-47.047,26.703 c-3.031,6.281-66.391,122.594-64.719,122.109c0,0-20.5,20.438-22.063,22.063c-8.625,9.281-8,17.297-8,25.313c0,0,0,75.297,0,92.563 c0,17.281,3.063,26.734,23.438,26.734h437c20.375,0,23.469-9.453,23.469-26.734c0-17.266,0-92.563,0-92.563 c0-8.016,0.594-16.031-8.063-25.313C488.406,277.547,467.875,257.109,467.875,257.109z M96.563,221.422 c0,0,40.703-73.313,43.094-78.109c4.125-8.203,15.844-14.141,27.828-14.141h177.031c12,0,23.703,5.938,27.828,14.141 c2.406,4.797,43.109,78.109,43.109,78.109c3.75,6.75,0.438,19.313-10.672,19.313H107.219 C96.109,240.734,92.813,228.172,96.563,221.422z M91.125,384.469c-20.656,0-37.406-16.734-37.406-37.391 c0-20.672,16.75-37.406,37.406-37.406s37.391,16.734,37.391,37.406C128.516,367.734,111.781,384.469,91.125,384.469z M312.781,394.578c0,2.734-2.219,4.953-4.938,4.953H204.172c-2.734,0-4.953-2.219-4.953-4.953v-45.672 c0-2.703,2.219-4.906,4.953-4.906h103.672c2.719,0,4.938,2.203,4.938,4.906V394.578z M420.875,384.469 c-20.656,0-37.422-16.734-37.422-37.391c0-20.672,16.766-37.406,37.422-37.406s37.406,16.75,37.406,37.406 S441.531,384.469,420.875,384.469z M152.906,49.25c0.016-10.047,8.172-18.203,18.219-18.219h169.75c10.031,0.016,18.188,8.172,18.203,18.219 v49.172h17.547V49.25c0-19.75-16-35.75-35.75-35.766h-169.75c-19.75,0.016-35.75,16.016-35.766,35.766v49.172h17.547V49.25z M195.141,92.938h8.891c0.438,0,0.719-0.266,0.719-0.672V56.328c0-0.281,0.156-0.422,0.406-0.422h12.063 c0.406,0,0.719-0.266,0.719-0.672v-7.469c0-0.406-0.313-0.688-0.719-0.688h-35.25c-0.438,0-0.719,0.281-0.719,0.688v7.469 c0,0.406,0.281,0.672,0.719,0.672h12.047c0.281,0,0.422,0.141,0.422,0.422v35.938C194.438,92.672,194.719,92.938,195.141,92.938z M237.438,47.078c-0.5,0-0.781,0.281-0.922,0.688l-16.391,44.5c-0.156,0.406,0,0.672,0.469,0.672h9.203 c0.484,0,0.766-0.203,0.906-0.672l2.672-8.031h16.688l2.719,8.031c0.156,0.469,0.438,0.672,0.938,0.672h9.094 c0.5,0,0.625-0.266,0.5-0.672l-16.125-44.5c-0.156-0.406-0.406-0.688-0.922-0.688H237.438z M247.25,75.813h-11l5.406-16.047h0.203 L247.25,75.813z M269.844,92.938h9.688c0.625,0,0.906-0.203,1.188-0.672l8.531-13.969h0.219l8.5,13.969 c0.281,0.469,0.531,0.672,1.188,0.672h9.734c0.516,0,0.641-0.406,0.453-0.813l-14.313-22.859l13.297-21.375 c0.234-0.406,0.078-0.813-0.406-0.813h-9.734c-0.563,0-0.844,0.203-1.141,0.688l-7.578,12.391h-0.219l-7.563-12.391 c-0.266-0.484-0.547-0.688-1.125-0.688h-9.75c-0.469,0-0.625,0.406-0.406,0.813l13.266,21.375l-14.234,22.859 C269.156,92.531,269.359,92.938,269.844,92.938z M320.422,47.766v44.5c0,0.406,0.281,0.672,0.688,0.672h8.922c0.406,0,0.688-0.266,0.688-0.672v-44.5 c0-0.406-0.281-0.688-0.688-0.688h-8.922C320.703,47.078,320.422,47.359,320.422,47.766z",
 fillColor: "#FFA500",
   fillOpacity: 1,
   strokeWeight: 0,
   rotation: 0,
   scale: 0.07

 };
  return (
    
    <div className="mt-5">
   
      <div className="flex flex-wrap lg:flex-nowrap justify-start">
        {/* Existing code for Earnings section */}
      </div>

      <div className="flex gap-10 m-4 flex-wrap justify-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-85 ml-20">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <label className="text-lg font-semibold">Pickup Location</label>
              <Autocomplete restrictions={{
                country:"lk" }}
                onLoad={(autocomplete) => setAutocompletePickup(autocomplete)}
          onPlaceChanged={() => onPickupPlaceSelected(autocompletePickup.getPlace())}
          >
                <input
                  type="text"
                  ref={originRef}
                  
                
                  placeholder="Enter pick up Location"
                  className="w-full p-3 border border-gray-300 rounded-md bg-F3F3F3 placeholder-gray-500 text-black "
                />
     </Autocomplete>
     <label className="text-lg font-semibold mt-4">Time</label>
                <input
                  type="time"
                  id='timeInput'
                  className="w-full p-3 border border-gray-300 rounded-md bg-F3F3F3 text-gray-500   "
                />
               
              </div>
          
              <div className="flex flex-col gap-4">
                <label className="text-lg font-semibold">Destination</label>
                <Autocomplete restrictions={{
                country:"lk"}}
                onLoad={(autocomplete) => setAutocompleteDestination(autocomplete)}
                onPlaceChanged={() => onDestinationPlaceSelected(autocompleteDestination.getPlace())}
                >
                <input
                  type="text"
                  ref={destiantionRef}
                  placeholder="Enter destination"
                  className="w-full p-3 border border-gray-300 rounded-md bg-F3F3F3 placeholder-gray-500 text-black "
                />
               </Autocomplete>
                
               
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">

              
            <button
  type="submit"
  style={{ backgroundColor: currentColor, borderRadius: '10px', color: 'white' , padding: '10px'}}
  onClick={handleBook}
>
  Book
</button>
{error && <div id="error" className="text-red-400">{error}</div>}
<div id='error' className='text-red-400'>

</div>
            </div>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl mr-20">
          <GridComponent
              dataSource={driverDetails}
              allowPaging
              allowSelection
              selectionSettings={{ type: 'Single', checkboxMode: 'ResetOnRowClick', mode: 'Row' }}
              height="300px"
              selectedRowIndex={selectedDriver ? driverDetails.findIndex(driver => driver.DriverID === selectedDriver.DriverID) : -1}
              rowSelected={(args) => {
                const selectedDriver = args.data;
                setSelectedDriver(selectedDriver);
              }}
            >
  <ColumnsDirective>
   
    <ColumnDirective field="fullName" headerText="Driver Name" width="150" />
    <ColumnDirective field="averageRating" headerText="Average Rating" width="150" />
    <ColumnDirective field="vehicleType" headerText="Vehicle type" width="150" />
    <ColumnDirective field="contactNumber" headerText="Contact Number" width="150" />
  </ColumnsDirective>
  <Inject services={[Page, Selection, Toolbar]} />
</GridComponent>


            <div className="mt-4">
            
             
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap justify-center">
        
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-1 p-4 rounded-2xl w-1200">
        <button  onClick={() => map.panTo(userLocation)} style={{ backgroundColor: currentColor, borderRadius: "50%", padding: "6px", marginBottom: "10px" } 
        }>
        <IoNavigate style={{ fontSize: "1.5em" }} />

</button>

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
    <Marker position={userLocation}></Marker>
</GoogleMap>
          </div>
        </div>
      </div>
      <div className="flex gap-1 flex-wrap justify-center mt-4">
 </div>
    </div>
  );
};

export default ReserveTaxi;
