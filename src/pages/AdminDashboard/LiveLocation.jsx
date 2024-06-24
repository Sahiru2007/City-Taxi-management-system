import React, {useEffect, useRef, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import { useStateContext } from '../../contexts/ContextProvider';
import {useJsApiLoader,GoogleMap, Marker, Autocomplete} from '@react-google-maps/api'
import { Skeleton } from '@mui/material'

const libraries = ['places']; 
const LiveLocation = () => {
    const { currentColor, currentMode } = useStateContext();
  const [driverCoordinates, setDriverCoordinates] = useState([]);
  const [driverDetails, setDriverDetails] = useState([])
  const [map, setMap] = useState(/** @type  google.maps.Map */ (null));

  const google_api = "AIzaSyD20F4BQVuvR6RDNum0VzfHoO0W4u5UTH4"
 
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api,
    libraries: libraries, // Pass libraries from the constant
  });

  useEffect(() => {

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


   

    
  }, []);

  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "orange",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,

 };

 if (!isLoaded) {
  return (
    // Your loading spinner or placeholder JSX here
    <Skeleton  />
  );
} 

  return (
    <div className="flex flex-col h-4/5 m-6 rounded-3xl overflow-hidden bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 mt-12">
      <div className="flex justify-between items-center gap-2 mb-4">
        <p className="font-semibold text-2xl">Live Location</p>
        <input
          type="text"
          placeholder="Search drivers..."
          className="border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

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
  );
};

export default LiveLocation;
