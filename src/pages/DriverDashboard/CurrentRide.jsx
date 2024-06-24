import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Toolbar,
} from '@syncfusion/ej2-react-grids';
import { MdOutlineCancel } from 'react-icons/md';
import { Button } from '../../components/PassengerDashboard';
import { useStateContext } from '../../contexts/ContextProvider';
import { CiLocationOn } from 'react-icons/ci';
import Avatar from '../../data/avatar3.png';
import {useJsApiLoader,GoogleMap, Marker, Autocomplete,  DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

import { Skeleton } from '@mui/material';
const dummyVehicleData = [
  {
    vehicleType: 'Car',
    registrationNumber: 'ABC123',
    vehicleModel: 'Sedan',
    vehicleMake: 'Toyota',
  },
];

const dummyCurrentRideData = [
  {
    rideID: 1,
    driverID: 1,
    from: 'City A',
    destination: 'City B',
    estimatedDistance: '10 km',
    time: '15:30',
    date: '2023-01-15',
    finalPrice: 'Pending',
  },
  // Add more dummy data as needed
];

const dummyDrivers = [
  {
    driverID: 1,
    driverName: 'John Doe',
    email: 'john@example.com',
    contactNumber: '123-456-7890',
    licenseNumber: 'ABC123',
    profilePicture: Avatar,
  },
];
const googleMapsLibraries = ['places'];
const CurrentRide = () => {
  const google_api = "AIzaSyD20F4BQVuvR6RDNum0VzfHoO0W4u5UTH4"
  const { currentColor } = useStateContext();
  const [userLocation, setUserLocation] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [directions, setDirections] = useState(null);
  const GuestPassenger = useRef(false);
  const [map, setMap] = useState(/** @type  google.maps.Map */(null));
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const directionsCallbackCalled = useRef(false);
  const {isLoaded}  = useJsApiLoader({
    googleMapsApiKey:google_api,
    libraries: googleMapsLibraries, // Use the constant here
   
  })
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
            if(reservationData[0].passengerId === "Guest"){
              GuestPassenger.current = true;
            }
            else{
             GuestPassenger.current = false;
            }
            if (reservationData.length === 1) {
              const pickupCoordinates = reservationData[0].pickupCoordinates;
              setPickupCoordinates(pickupCoordinates);
              const destinationCoordinates = reservationData[0].destinationCoordinates;
              setDestinationCoordinates(destinationCoordinates);
    
              // Log the coordinates to verify they are being retrieved correctly
              console.log('Pickup Coordinates:', pickupCoordinates);
              console.log('Destination Coordinates:', destinationCoordinates);

           
            }
           
            
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
  }, []);
  if (!isLoaded) {
    return (
      // Your loading spinner or placeholder JSX here
      <Skeleton  />
    );
  } 
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
  const handleFinalize = async () => {
    const errorDiv = document.getElementById('errorDiv');
    const receivedPaymentCheckbox = document.getElementById('receivedPayment');

    let receivedPayment  = null
// Check if the checkbox is checked
if(GuestPassenger.current == true){
  receivedPayment = receivedPaymentCheckbox.checked;
}
    console.log(receivedPayment)
    if(reservations[0].paymentStatus === "Completed" || receivedPayment){
    try {

      const reservationId = reservations[0]._id;
      console.log(reservations[0])
  
      const response = await fetch(`http://localhost:8080/api/reservationRequests/changeStatus/${reservationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Completed',
          paymentStatus: 'Completed'
        }),
      });
  
      if (response.ok) {
        errorDiv.classList.add("text-green-400");
        errorDiv.innerHTML = 'Reservation has successfully completed';
        console.log('Reservation Finished updated successfully');
  
        // Remove items from the table
        setReservations([]);
  
        // Clear destination and pickup coordinates
        setPickupCoordinates(null);
        setDestinationCoordinates(null);
  
        // Clear directions on the map
        setDirections(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        console.error('Failed to update reservation status:', errorData.message);
      }
    } catch (error) {
      setError('Error updating reservation status');
      console.error('Error updating reservation status:', error.message);
    }
  }
  else{
    errorDiv.classList.add("text-red-400");
    errorDiv.innerHTML = "Payment hasn't been made yet. Inform the passenger to do so.";
  }
  };
  
  const handleCancel = async () => {
    try {
      const reservationId = reservations[0]._id;
      console.log(reservationId)
        const response = await fetch(`http://localhost:8080/api/reservationRequests/changeStatus/${reservationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'Canceled',
            }),
        });

        if (response.ok) {
            console.log("Reservation status updated successfully");

           
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
  return (
    <div className="mt-5">
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Current Ride's Details</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-6 gap-3">
            <thead>
              <tr>
                <th className="text-left px-10 py-2 ">Passenger Name</th>
                <th className="text-left px-10 py-2">PickUp location</th>
                <th className="text-left px-10 py-2">Destination</th>
                <th className="text-left px-10 py-2">Distance</th>
                <th className="text-left px-10 py-2">Duration</th>
                <th className="text-left px-10 py-2">Time</th>
                <th className="text-left px-10 py-2">Contact</th>
                <th className="text-left px-10 py-2">Payment</th>
              </tr>
            </thead>
          
<tbody>
  {reservations.map((reservation) => (
    <tr key={reservation._id}> {/* Use _id as the unique key */}
      <td className="text-left px-10 py-2">{reservation.passengerName}</td>
      <td className="text-left px-10 py-2">{reservation.pickupLocation}</td>
      <td className="text-left px-10 py-2">{reservation.destination}</td>
      <td className="text-left px-10 py-2">{reservation.distance}</td>
      <td className="text-left px-10 py-2">{reservation.duration}</td>
      <td className="text-left px-10 py-2">{reservation.time}</td>
      <td className="text-left px-10 py-2">{reservation.passengerContactNumber}</td>
      <td className="text-left px-10 py-2">Rs.{reservation.totalPayment}</td>
    </tr>
  ))}
</tbody>


          </table>
        </div>

        <div className="flex justify-between items-center mt-5 border-t-1 border-color">
  <div className="mt-3">
             
  <button
  type="submit"
  style={{ backgroundColor: currentColor, borderRadius: '10px', color: 'black' , padding: '10px' }}
  onClick={handleCancel}
>
  Cancel
</button>

  </div>
  <div className='text-green-400' id='errorDiv'></div>
  <div className="mt-3 flex items-center">
    {/* Add checkboxes for Received Payment and Reached Destination */}
    {GuestPassenger.current && (
            <div className="mr-3">
              <input
                type="checkbox"
                id="receivedPayment"
              />
              <label htmlFor="receivedPaymentCheckbox" className="mr-4">Received Payment</label>
            </div>
          )}
    <button
  type="submit"
  style={{ backgroundColor: currentColor, borderRadius: '10px', color: 'black' , padding: '10px' }}
  onClick={handleFinalize}
>
  Finalize Ride
</button>

  </div>
</div>
</div>


   

     
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
  <h2 className="text-xl font-semibold mb-4">Live Map</h2>
  <div className="w-full md:w-1/4 lg:w-2/3 xl:w-full mx-auto m-5">
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
  {pickupCoordinates && (
    <Marker
      position={pickupCoordinates}
      icon={svgMarker}
     
    ></Marker>
  )}
  {pickupCoordinates && (
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
                      directionsCallbackCalled.current = true; // Set the flag to true after processing the response
                    }
                  }}
                />
              )}

  {directions && <DirectionsRenderer directions={directions} />}
</GoogleMap>

  </div>
</div>

</div>
  );
};

export default CurrentRide;
