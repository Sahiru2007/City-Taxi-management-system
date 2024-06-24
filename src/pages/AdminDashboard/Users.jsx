import React, { useEffect, useState } from 'react';
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
import { Header } from '../../components/PassengerDashboard';

const Users = () => {
  const toolbarOptions = ['Search', 'Delete'];
  const selectionsettings = { persistSelection: true };
  const [passengerDetails, setPassengerDetails] = useState([]);
  const editing = { allowDeleting: true, allowEditing: true };

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/passenger/admin/details');
        const data = await response.json();

        setPassengerDetails(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching and filtering passenger details:', error.message);
      }
    };

    fetchDriverDetails();
  }, []);

  let grid = null;
  const handleToolBarClick = (args) => {
    if (grid) {
      if (args.item.id.includes('pdfexport')) {
        const currentDate = new Date().toLocaleString(); // Get current date and time
        const headerContent = `Passenger Data - ${currentDate}`;

        const pdfExportProperties = {
          fileName: 'PassengerData.pdf',
          exportType: 'All',
          pageOrientation: 'Landscape',
          pageSize: 'A3',
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
        const headerContent = `Passenger Data - ${currentDate}`;
        grid.excelExport({
          fileName: 'PassengerData.xlsx',
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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header title="Passengers" />
      <GridComponent dataSource={passengerDetails}
        ref={(g) => (grid = g)}
        allowPaging={true}
        toolbar={['PdfExport', 'ExcelExport', 'Search']}
        allowPdfExport={true}
        allowExcelExport
        toolbarClick={handleToolBarClick}
      >
        <ColumnsDirective>
          {passengerDetails.length > 0 &&
            Object.keys(passengerDetails[0]).map((field, index) => {
              if (field !== '_id' && field !== 'latitude' && field !== 'longitude') {
                return <ColumnDirective key={index} field={field} headerText={field} />;
              }
              return null;
            })}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, Search, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Users;
