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

const Payments = () => {
  const toolbarOptions = ['Search', 'Delete'];
  const selectionsettings = { persistSelection: true };
  const [paymentDetails, setPaymentDetails] = useState([]);
  const editing = { allowDeleting: true, allowEditing: true };

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/payment/admin');
        const data = await response.json();

        // Check if data is not empty before modifying
        if (data.length > 0) {
          // Map the data to include only relevant fields and exclude 'id', 'latitude', and 'longitude'
          const modifiedData = data.map(({ _id, ...rest }) => rest);
          setPaymentDetails(modifiedData);
          console.log(modifiedData);
        } else {
          console.log('No payment details available.');
        }
      } catch (error) {
        console.error('Error fetching and filtering payment details:', error.message);
      }
    };

    fetchPaymentDetails();
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
        const headerContent = `Payment Data - ${currentDate}`;

        const pdfExportProperties = {
          fileName: 'PaymentData.pdf',
          exportType: 'All',
          pageOrientation: 'Landscape',
          pageSize: "A4",
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
        const headerContent = `Driver Data - ${currentDate}`;
        grid.excelExport({
          
          fileName: 'driverData.xlsx',
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
      <Header title="Payments" />
      <GridComponent dataSource={paymentDetails}
        ref={g => grid = g}
        allowPaging={true}
        toolbar={['PdfExport', 'ExcelExport', 'Search']}
        allowPdfExport={true}
        allowExcelExport
        toolbarClick={handleToolBarClick}
      >
        <ColumnsDirective>
          {paymentDetails.length > 0 &&
            Object.keys(paymentDetails[0]).map((field, index) => {
              if (field !== 'latitude' && field !== 'longitude') {
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

export default Payments;
