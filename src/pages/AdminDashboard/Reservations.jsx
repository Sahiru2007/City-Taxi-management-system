import React, { useState, useEffect } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Search,
  Sort,
  Toolbar,
  ContextMenu,
  Delete,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from '@syncfusion/ej2-react-grids';
import { Button } from '../../components/PassengerDashboard';
import { MdOutlineCancel, MdAdd } from 'react-icons/md';
import { Header } from '../../components/PassengerDashboard';
import { useStateContext } from '../../contexts/ContextProvider';

const Reservations = () => {
  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Search', 'Delete', 'ExcelExport', 'PdfExport'];
  const editing = { allowDeleting: true, allowEditing: true };
  const { currentColor, currentMode } = useStateContext();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    try {
      fetch(`http://localhost:8080/api/reservation/admin`)
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
          console.log(reservationData)
        })
        .catch((error) => {
          console.error('Error fetching reservations:', error.message);
        });
    } catch (parseError) {
      console.error('Error parsing reservation data:', parseError);
    }
  }, []);

  const handleAddButtonClick = () => {
    // Implement the logic for adding here
    console.log('Add button clicked');
  };
  let grid = null;

  const handleToolBarClick = (args) => {
    if (grid) {
      
      if (args.item.id.includes('pdfexport')) {
        const currentDate = new Date().toLocaleString(); // Get current date and time
        const headerContent = `Reservation Data - ${currentDate}`;

        const pdfExportProperties = {
          fileName: 'ReservationData.pdf',
          exportType: 'All',
          pageOrientation: 'Landscape',
          pageSize: "A3",
          header: {
            fromTop: 0,
            height: 30,
            contents: [{
              type: 'Text',
              value: headerContent,
              position: { x: 0, y: 0 },
              style: { textBrushColor: '#000000', fontSize: 12 }
            }]
          }
        };

        grid.pdfExport(pdfExportProperties);
      } else if (args.item.id.includes('excelexport')) {
        const currentDate = new Date().toLocaleString(); // Get current date and time
        const headerContent = `Reservation Data - ${currentDate}`;
        grid.excelExport({
          
          fileName: 'reservationData.xlsx',
          exportType: 'All',
          header: {
            fromTop: 0,
            height: 30,
            contents: [{
              type: 'Text',
              value: headerContent,
              position: { x: 0, y: 0 },
              style: { textBrushColor: '#000000', fontSize: 12 }
            }]
          }
        });
      }
    }
  };

  const modifiedReservations = reservations.map(reservation => {
    const formattedDate = new Date(reservation.date).toLocaleDateString();
    
    const matchHours = /(\d+) hours?/.exec(reservation.duration);
    const matchMinutes = /(\d+) mins?/.exec(reservation.duration);
  
    let formattedDuration = reservation.duration;
  
    if (matchHours) {
      formattedDuration = `${matchHours[1].padStart(2, '0')}.00`;
    } else if (matchMinutes) {
      formattedDuration = `00.${matchMinutes[1].padStart(2, '0')}`;
    }
  
    return {
      ...reservation,
      date: formattedDate,
      duration: formattedDuration
    };
  });
  
  
  const columns = [
    { field: 'driverName', headerText: 'Driver Name', width: 130, allowResizing: true, allowTextWrap: false },
    { field: 'passengerName', headerText: 'Passenger Name', width: 130, allowResizing: true, allowTextWrap: false },
    { field: 'date', headerText: 'Date', width: 120, allowResizing: true, allowTextWrap: false },
    { field: 'driverContactNumber', headerText: 'Driver Contact', width: 120, allowResizing: true, allowTextWrap: false },
    { field: 'pickupLocation', headerText: 'Pickup Location', width: 170, allowResizing: true, allowTextWrap: false },
    { field: 'destination', headerText: 'Destination', width: 170, allowResizing: true, allowTextWrap: false },
    { field: 'distance', headerText: 'Distance', width: 100, allowResizing: true, allowTextWrap: false },
    { field: 'duration', headerText: 'Duration', width: 100, allowResizing: true, allowTextWrap: false },
    { field: 'status', headerText: 'Status', width: 100, allowResizing: true, allowTextWrap: false },
    { field: 'totalPayment', headerText: 'Payment', width: 100, allowResizing: true, allowTextWrap: false },
    { field: 'rating', headerText: 'Rating', width: 100, allowResizing: true, allowTextWrap: false },
    { field: 'paymentStatus', headerText: 'Payment Status', width: 100, allowResizing: true, allowTextWrap: false },
  ];
  

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl" style={{ overflowX: 'hidden', maxWidth: '78%' }}>
      <Header title="Reservations" />
      

      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
      <GridComponent dataSource={modifiedReservations}
        ref={g => grid = g}
        allowPaging={true}
        toolbar={['PdfExport', 'ExcelExport', 'Search']}
        allowPdfExport={true}
        allowExcelExport
        toolbarClick={handleToolBarClick}
      >
          <ColumnsDirective>
            {columns.map((column, index) => (
              <ColumnDirective key={index} {...column} />
            ))}
          </ColumnsDirective>
          <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, Search, Toolbar]} />
        </GridComponent>
      </div>
    </div>
  );
};

export default Reservations;
