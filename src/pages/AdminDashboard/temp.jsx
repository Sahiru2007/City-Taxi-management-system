import React, { useState, useEffect } from 'react';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { Skeleton } from '@mui/material';

// Define the required Google Maps libraries
const googleMapsLibraries = ['places'];

const ReserveTaxi = () => {
  // Replace the placeholder with your actual Google Maps API key
    const google_api = "Google_API_KEY";
  
  // State to store driver details and map instance
  const [driverDetails, setDriverDetails] = useState([]);
  const [map, setMap] = useState(null);

  // Check if Google Maps API is loaded
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api,
    libraries: googleMapsLibraries,
  });

  // Fetch driver details and filter based on distance
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        // Fetch driver details from the backend
        const response = await fetch('http://localhost:8080/api/driver/getDriverDetails');
        const data = await response.json();

        // Get user's current location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const userLat = latitude;
        const userLng = longitude;

        // Filter drivers based on a distance threshold (e.g., 40 km)
        const filteredDrivers = data.filter((driver) => {
          const driverLat = driver.latitude;
          const driverLng = driver.longitude;
          const distance = calculateDistance(userLat, userLng, driverLat, driverLng);
          return distance <= 40;
        });

        // Set the filtered driver details in the state
        setDriverDetails(filteredDrivers);
      } catch (error) {
        console.error('Error fetching and filtering driver details:', error.message);
      }
    };

    // Fetch driver details when the component mounts
    fetchDriverDetails();
  }, []);

  // Render the component
  return (
    <div className="mt-5">
      {/* Check if Google Maps API is loaded */}
      {isLoaded ? (
        <div className="flex gap-1 flex-wrap justify-center">
          <div className="flex justify-between rounded-2xl">
            {/* Render Google Map */}
            <GoogleMap
              center={userLocation} // Provide the center coordinates (replace with actual coordinates)
              zoom={13} // Set the initial zoom level
              mapContainerStyle={{ width: '100%', height: '50vh', borderRadius: '20px' }}
              options={{
                streetViewControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => setMap(map)} // Store the map instance in the state
            >
              {/* Additional components like Markers can be added here */}
            </GoogleMap>
          </div>
        </div>
      ) : (
        // Render a loading skeleton while the Google Maps API is loading
        <Skeleton />
      )}
    </div>
  );
};

export default ReserveTaxi;
