import React, { useState, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Search, Sort, Toolbar, ContextMenu, Delete, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { Header } from '../../components/PassengerDashboard';
import { useStateContext } from '../../contexts/ContextProvider';

const Reservations = () => {
  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Search'];
  const editing = { allowDeleting: false, allowEditing: false };
  const { currentColor, currentMode } = useStateContext();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    console.log(storedUserData);
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);

        const userId = parsedUserData._id;

        // Make an API request to get reservation requests for the driver
        fetch(`http://localhost:8080/api/travelHistory/${userId}`)
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
  }, []);

// ... (previous code)

const columns = reservations.length > 0 ?
  [
    <ColumnDirective key="date" field="date" headerText="Date" width={120} template={(props) => <div>{new Date(props.date).toLocaleDateString()}</div>} />,
    <ColumnDirective key="driverName" field="driverName" headerText="Driver Name" width={150} />,
    <ColumnDirective key="pickupLocation" field="pickupLocation" headerText="Pickup Location" width={180} />,
    <ColumnDirective key="destination" field="destination" headerText="Destination" width={180} />,
    <ColumnDirective key="distance" field="distance" headerText="Distance" width={120} />,
    <ColumnDirective key="totalPayment" field="totalPayment" headerText="Total Payment" width={120} />,
    <ColumnDirective key="vehicleType" field="vehicleType" headerText="Vehicle Type" width={120} />,
  <ColumnDirective key="vehicleRegistrationNumber" field="vehicleRegistrationNumber" headerText="Vehicle Registration Number" width={180} />,
  <ColumnDirective key="rating" field="rating" headerText="Rating" width={100} />,
  ] :
  null;

  
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header title="My History" />
      <div className="flex justify-between items-center mb-4">
        {/* Your existing button */}
      </div>

      <GridComponent
        id="gridcomp"
        dataSource={reservations}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {columns}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, Filter, Page, ExcelExport, Edit, PdfExport, Search, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Reservations;
