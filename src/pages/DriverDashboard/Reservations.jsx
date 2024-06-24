import React, { useState, useEffect } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { MdOutlineCancel } from 'react-icons/md';
import { LinkButton } from '../../components/PassengerDashboard';
import { useStateContext } from '../../contexts/ContextProvider';

const dummyPassengerRequests = [
  {
    customerId: 'C001',
    customerName: 'Alice Doe',
    from: 'City A',
    destination: 'City B',
    time: '15:30',
    date: '2023-01-15',
    requestedVehicleType: 'Sedan',
    contactNumber: '123-456-7890',
  },
  {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  },
  {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  }, {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  }, {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  }, {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  },
  {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  }, {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  }, {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  }, {
    customerId: 'C002',
    customerName: 'Bob Smith',
    from: 'City C',
    destination: 'City D',
    time: '18:45',
    date: '2023-01-16',
    requestedVehicleType: 'SUV',
    contactNumber: '987-654-3210',
  },
];
const dummyReservations = [
    {
      tripId: 'T001',
      customerId: 'C001',
      name: 'Alice Doe',
      from: 'City A',
      destination: 'City B',
      distance: '100 km',
      time: '15:30',
      date: '2023-01-15',
      status: 'Finished',
    },
    {
      tripId: 'T002',
      customerId: 'C002',
      name: 'Bob Smith',
      from: 'City C',
      destination: 'City D',
      distance: '150 km',
      time: '18:45',
      date: '2023-01-16',
      status: 'Ongoing',
    },
    {
      tripId: 'T003',
      customerId: 'C003',
      name: 'Charlie Brown',
      from: 'City E',
      destination: 'City F',
      distance: '120 km',
      time: '12:00',
      date: '2023-01-17',
      status: 'Cancelled',
    },
  ];
  
const Reservation= () => {
  const { currentColor } = useStateContext();
  const [userLocation, setUserLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchTextRequest, setSearchTextRequest] = useState('');
  const [sortedData, setSortedData] = useState(dummyReservations);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [sortOrder, setSortOrder] = useState({
    column: null,
    ascending: true,
  });
  const [reservations, setReservations] = useState([]);
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
  
  
  useEffect(() => {
    
    const storedUserData = localStorage.getItem('userData');
    //get reservation requests
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

      //get reservation data
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setDriverId(parsedUserData._id);
      
          const driverId = parsedUserData._id;
      
          // Make an API request to get reservation requests for the driver
          fetch(`http://localhost:8080/api/reservation/reservationData/${driverId}`)
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
              
            })
            .catch(error => {
              console.error('Error fetching requests:', error.message);
            });
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
     
    }
  }


    
  }, []);  // Add dependencies if needed
  
  const sortStringColumn = (columnName, isAscending) => {
    return [...sortedData].sort((a, b) => {
      const aValue = String(a[columnName]).toLowerCase();
      const bValue = String(b[columnName]).toLowerCase();
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  };

  const sortDateTimeColumn = (columnName, isAscending) => {
    return [...sortedData].sort((a, b) => {
      return isAscending
        ? new Date(a[columnName]).getTime() - new Date(b[columnName]).getTime()
        : new Date(b[columnName]).getTime() - new Date(a[columnName]).getTime();
    });
  };

  const handleSort = (columnName) => {
    const isAscending = sortOrder.column === columnName && sortOrder.ascending;

    let sorted;
    if (columnName === 'time' || columnName === 'date') {
      sorted = sortDateTimeColumn(columnName, isAscending);
    } else {
      sorted = sortStringColumn(columnName, isAscending);
    }

    setSortedData(sorted);
    setSortOrder({
      column: columnName,
      ascending: !isAscending,
    });
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  }, []);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const handleSearchRequest = (e) => {
    setSearchTextRequest(e.target.value);
  };


  const filterDataRequests = () => {
    return requests.filter((item) =>
      Object.values(item).some(
        (value) => String(value).toLowerCase().includes(searchTextRequest.toLowerCase())
      )
    );
  };
  const filterDataReservations = () => {
    return reservations.filter((item) =>
      Object.values(item).some(
        (value) => String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  // Filtered data for reservation requests
  const filteredRequests = filterDataRequests();

  // Filtered data for reservations
  const filteredReservations = filterDataReservations();
  return (
    <div className="mt-10">
    

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-1200 max-h-[600px] overflow-y-auto pb-10">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Reservation Requests</p>
            <input
              type="text"
              placeholder="Search..."
              value={searchTextRequest}
              onChange={handleSearchRequest}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
    
          <div className="table-container">
          <table className="w-full mt-6">
        <thead>
          <tr>
         
            <th className="text-left px-5 py-2">Passenger Name</th>
            <th className="text-left px-5 py-2">PickUp location</th>
            <th className="text-left px-5 py-2">Destination</th>
            <th className="text-left px-5 py-2">Time</th>
            <th className="text-left px-5 py-2">Estimated Distance</th>
            <th className="text-left px-5 py-2">Estimated Duration</th>
            <th className="text-left px-5 py-2">Contact</th>
            <th className="text-left px-5 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto max-h-[300px]">
  {filteredRequests.map((request, index) => (
    <tr key={request._idId} className={index === 0 ? '' : 'border-none'}>
      <td className="px-5 py-4"  hidden>{request._id}</td>
      <td className="px-5 py-4">{request.passengerName}</td>
      <td className="px-5 py-2">{request.pickupLocation}</td>
      <td className="px-5 py-2">{request.destination}</td>
      <td className="px-5 py-2">{request.time}</td>
      <td className="px-5 py-2">{request.distance}</td>
      <td className="px-5 py-2">{request.duration}</td>
      <td className="px-5 py-2">{request.passengerContactNumber}</td>
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
          </div>

          
        </div>
      </div>

      <div className="flex gap-10 flex-wrap justify-center mt-20">
        {/* New table for Reservations */}
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-1200 max-h-[384px] overflow-y-auto">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Reservations</p>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearch}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="table-container">
            <table className="w-full mt-6">
            <thead>
  <tr>
 
    <th className="text-left px-5 py-2">Passenger Name</th>
    <th className="text-left px-5 py-2">PickUp location</th>
    <th className="text-left px-5 py-2">Destination</th>
    <th className="text-left px-5 py-2">Time</th>
    <th className="text-left px-5 py-2">Estimated Distance</th>
    <th className="text-left px-5 py-2">Estimated Duration</th>
    <th className="text-left px-5 py-2">Contact</th>
    <th className="text-left px-5 py-2">Status</th>
  </tr>
</thead>
<tbody className="overflow-y-auto max-h-[300px]">
{filteredReservations.map((reservation, index) => (
                  <tr key={reservation.tripId} className={index === 0 ? '' : 'border-none'}>
<td className="px-5 py-4"  hidden>{reservation._id}</td>
<td className="px-5 py-4">{reservation.passengerName}</td>
<td className="px-5 py-2">{reservation.pickupLocation}</td>
<td className="px-5 py-2">{reservation.destination}</td>
<td className="px-5 py-2">{reservation.time}</td>
<td className="px-5 py-2">{reservation.distance}</td>
<td className="px-5 py-2">{reservation.duration}</td>
<td className="px-5 py-2">{reservation.passengerContactNumber}</td>
<td className="flex items-center gap-2" width={"200px"}>
                      {reservation.status === 'Finished' && (
                        <span className="text-green-500 font-bold">● {reservation.status}</span>
                      )}
                      {reservation.status === 'OnGoing' && (
                        <span className="text-yellow-500 font-bold">● {reservation.status}</span>
                      )}
                      {reservation.status === 'Requested' && (
                        <span className="text-gray-300 font-bold">● {reservation.status}</span>
                      )}
                      {reservation.status === 'Declined' && (
                        <span className="text-red-700 font-bold">● {reservation.status}</span>
                      )}
                      {reservation.status === 'Canceled' && (
                        <span className="text-red-700 font-bold">● {reservation.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Other components or content */}
    </div>
  );
};

export default Reservation;

