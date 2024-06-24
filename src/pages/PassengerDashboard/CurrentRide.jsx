import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer,  Popup } from 'react-leaflet';
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
import { Rating, Typography, Box } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';

import { Button } from '../../components/PassengerDashboard';
import { useStateContext } from '../../contexts/ContextProvider';
import { CiLocationOn } from 'react-icons/ci';
import Avatar from '../../data/avatar3.png';
import {useJsApiLoader,GoogleMap, Marker, Autocomplete,  DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Skeleton } from '@mui/material';
import DirectionsDisplay from '../../components/DirectionDisplay';
const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];


const googleMapsLibraries = ['places'];
const CurrentRide = () => {
  const [stripe, setStripe] = useState(null);
  const { currentColor } = useStateContext();
  const [userLocation, setUserLocation] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [directions, setDirections] = useState(null);
    const google_api = "Google_API_KEY"
  const [map, setMap] = useState(/** @type  google.maps.Map */(null));
  const [rating, setRating] = useState(null);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [cancelStatus, setCancelStatus] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false); 
  const directionsCallbackCalled = useRef(false);
  const [Payment, setPayment] = useState(null);
  const [numericRating, setNumericRating] = useState(null);
  const [hover, setHover] = useState(-1); // Add hover state
  const [reservationId, setReservationId] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api,
    libraries: googleMapsLibraries, // Use the constant here
  });
  
  const initializeStripe = async () => {
    try {
      const stripeKey =
        'pk_test_51OaK8GIHxKiWcbbg97KaguBIGQhZnbfUF3YV77LXPFzLsijL0sqJswWSwClIO3GEVMpFTsd77WQo1JxxhHcrPW6W00KdYpfNWO';
      const stripeObject = await loadStripe(stripeKey);
      setStripe(stripeObject);
    } catch (error) {
      console.error('Error initializing Stripe:', error.message || error);
      // Handle the error as needed
    }
  };
  
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    console.log(storedUserData)
    initializeStripe()
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
    
              // Log the coordinates to verify they are being retrieved correctly
              console.log('Pickup Coordinates:', pickupCoordinates);
              console.log('Destination Coordinates:', destinationCoordinates);
                console.log(response)
           
            }
            setReservationId(reservationData[0]._id)
           
            setPayment(reservationData[0].totalPayment)
    
    
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
          console.log('Reservation status updated successfully');
          setCancelStatus('Reservation cancelled successfully'); // Set the success message
           setIsCancelled(true); // Set the cancellation flag to true
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

const handleRatingChange = async (_, newValue) => {
  // Ensure newValue is a valid number between 1 and 5
  const newRating = typeof newValue === 'number' ? Math.min(5, Math.max(1, newValue)) : 0;

  setRating(newRating);
  setNumericRating(newRating); // Set the numerical rating separately

  try {
    const response = await fetch(`http://localhost:8080/api/rating/${reservationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: newRating,
      }),
    });

    if (response.ok) {
      console.log('Rating updated successfully');
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
const handleBuyClick = async () => {
  const errorDiv = document.getElementById('errorDiv');
  if (stripe) {
    try {
      const response = await fetch('http://localhost:8080/api/payment/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservation: {
            amount: Payment,
            id: reservationId,
          },
        }),
      });
      console.log(Payment)

      if (!response.ok) {
        let errorMessage = '';
        try {
          // Try to parse the error response as JSON
          const errorResponse = await response.json();
          errorMessage = errorResponse.error;
        } catch (jsonError) {
          // If parsing fails, use the default error message
          errorMessage = 'An unexpected error occurred.';
        }

        // Display the error message in the errorDiv
        errorDiv.innerHTML = errorMessage;

        throw new Error(errorMessage);
      }


      
      const session = await response.json();
      await stripe.redirectToCheckout({ sessionId: session.id });
      
     
    } catch (error) {
      if (error.message === 'API endpoint not found') {
        // Handle 404 error differently, e.g., show a user-friendly message
        console.error('API endpoint not found');
      } else if (error.message === 'Internal server error') {
        // Handle 500 error differently, e.g., show a user-friendly message
        console.error('Internal server error');
      } else {
        // Handle other errors
        console.error('Error:', error.message || error);
      }
    }
  } else {
    console.error('Stripe.js not loaded');
  }

 
};


  return (
    
    <div className="mt-5">
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
      <div className='text-red-400' id='errorDiv'></div>
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Current Ride's Details</p>
        </div>
        <div className='cancelStatus text-color-red'>
          {cancelStatus}
        </div>
        <div className="overflow-x-auto">
        <table className="w-full mt-6 gap-3">
            <thead>
              <tr>
                <th className="text-left px-10 py-2 ">Driver Name</th>
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
      <td className="text-left px-10 py-2">{reservation.driverName}</td>
      <td className="text-left px-10 py-2">{reservation.pickupLocation}</td>
      <td className="text-left px-10 py-2">{reservation.destination}</td>
      <td className="text-left px-10 py-2">{reservation.distance}</td>
      <td className="text-left px-10 py-2">{reservation.duration}</td>
      <td className="text-left px-10 py-2">{reservation.time}</td>
      <td className="text-left px-10 py-2">{reservation.driverContactNumber}</td>
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
>cancel</button>
          </div>
          
          <Rating
  name="hover-feedback"
  value={rating !== null ? rating : 0}
  precision={0.5}
  onChange={handleRatingChange}
/>
{rating !== null && (
  <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
)}

  
          <div className="mt-3">
          <button
  type="submit"
  style={{ backgroundColor: currentColor, borderRadius: '10px', color: 'black' , padding: '10px' }}
  onClick={handleBuyClick}
>Pay</button>
           
          </div>
          
        </div>
      </div>

      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Vehicle's Details</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full mt-6 gap-3">
            <thead>
              <tr>
                <th className="text-left px-10 py-2 ">Vehicle Type</th>
                <th className="text-left px-10 py-2">Vehicle Model</th>
                <th className="text-left px-10 py-2">Vehicle Make</th>
                <th className="text-left px-10 py-2">Vehicle Registration Number</th>
               
              </tr>
            </thead>
          
<tbody>
  {reservations.map((reservation) => (
    <tr key={reservation._id}> {/* Use _id as the unique key */}
      <td className="text-left px-10 py-2">{reservation.vehicleType}</td>
      <td className="text-left px-10 py-2">{reservation.vehicleModel}</td>
      <td className="text-left px-10 py-2">{reservation.vehicleMake}</td>
      <td className="text-left px-10 py-2">{reservation.vehicleRegistrationNumber}</td>
      
    </tr>
  ))}
</tbody>


          </table>
        </div>
      </div>

    
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
  <h2 className="text-xl font-semibold mb-4">Live Map</h2>
  <div className="w-full md:w-1/4 lg:w-2/3 xl:w-full mx-auto m-5">
  <GoogleMap
            center={userLocation}
            zoom={10}
            mapContainerStyle={{ width: '100%', height: '50vh', borderRadius: '20px' }}
            options={{
              streetViewControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={userLocation}></Marker>
            {pickupCoordinates && !isCancelled && (
              <Marker
                position={pickupCoordinates}
                icon={svgMarker}
              ></Marker>
            )}
            {destinationCoordinates && !isCancelled && (
              <Marker
                position={destinationCoordinates}
                icon={svgMarkerDestination}
              ></Marker>            )}

            {pickupCoordinates && destinationCoordinates && !directionsCallbackCalled.current && !isCancelled && (
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
  );
};

export default CurrentRide;
