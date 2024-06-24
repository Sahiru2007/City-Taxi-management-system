
import React, { useRef, useEffect, useState } from 'react';
import { ChartsHeader,Pie } from '../../components/AdminDashboard';
import { useStateContext } from '../../contexts/ContextProvider';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, Legend, Tooltip, DataLabel,  Category,  } from '@syncfusion/ej2-react-charts';
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip, Export } from '@syncfusion/ej2-react-charts';

const Reports = () => {
  const { currentMode , currentColor} = useStateContext();
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [vehicleStats, setVehicleStats] = useState([]);

  useEffect(() => {

    try {

        fetch(`http://localhost:8080/api/adminDashboard`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Invalid response format');
            }
    
            const dashboardData = await response.json();
          setVehicleStats(dashboardData.vehicleTypeStats)
         
          })
          .catch(error => {
            console.error('Error fetching requests:', error.message);
          });
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
      }

    try {
      fetch(`http://localhost:8080/api/reservationChart/`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format');
          }

          const reservationData = await response.json();
          setChartData(reservationData);
          console.log(reservationData)
        })
        .catch((error) => {
          console.error('Error fetching reservations:', error.message);
        });
    } catch (parseError) {
      console.error('Error parsing reservation data:', parseError);
    }
  }, []);





  let chartInstance;
function clickHandler() {
  const header = {
    content: 'Chart Header',
    fontSize: 15,
  };

  const footer = {
    content: 'Chart Footer',
    fontSize: 15,
  };

  // Backup the original chart background color
  const originalBackgroundColor = chartInstance.background;

  // Set the background color of the chart to white for export
  chartInstance.background = '#fff';

  // Subscribe to beforeExport event to customize PDF export
  chartInstance.beforeExport = (args) => {
    // Check if the chart element exists before setting background color
    if (args.chart && args.chart.chartElement) {
      args.chart.chartElement.style.backgroundColor = '#fff'; // Set chart background color to white for the PDF export
    }
  };

  // Export the chart to PDF
  chartInstance.exportModule.export('PDF', 'Chart', 1, [chartInstance], null, null, true, header, footer);

  // Reset the chart background color after exporting
  chartInstance.background = originalBackgroundColor;
  // Reset the chartInstance.beforeExport after exporting
  chartInstance.beforeExport = null;
}

  
  

  const primaryxAxis = {
    title: 'Day',
    valueType: 'Category',
    majorGridLines: { width: 0 },
    labelStyle: { fontFamily: 'Poppins, sans-serif' },
    titleStyle: { fontFamily: 'Poppins, sans-serif', color: currentMode === 'Dark' ? '#fff' : '#333' },
  };

  const primaryyAxis = {
    title: 'Number of Reservations',
    minimum: 0,
    majorGridLines: { width: 0 },
    labelStyle: { fontFamily: 'Poppins, sans-serif' },
    titleStyle: { fontFamily: 'Poppins, sans-serif', color: currentMode === 'Dark' ? '#fff' : '#333' },
  };

  const chartFont = {
    size: '14px',
    fontWeight: '400',
    color: currentMode === 'Dark' ? '#fff' : '#333',
    fontFamily: 'Poppins, sans-serif',
  };

  const titleStyle = {
    text: 'Reservation Count Over Last 7 Days',
    textStyle: { ...chartFont },
  };

  const chartTheme = {
    axisLabelFont: { ...chartFont },
    axisTitleFont: { ...chartFont },
    legendLabelFont: { ...chartFont },
  };
  const vehicleStatsData = vehicleStats.map((item) => ({
    x: item.vehicleType,
    y: item.count,
    text: `${item.percentage.toFixed(2)}%`,
  }));
  let pieChartInstance;
  function exportPieChart() {
    const header = {
      content: 'Vehicle Types in reservations',
      fontSize: 15,
    };
  
   
  
    // Check if pieChartInstance is defined before setting beforeExport
    if (pieChartInstance) {
      // Backup the original chart background color
      const originalBackgroundColor = pieChartInstance.background;
  
    
      pieChartInstance.exportModule.export('PDF', 'PieChart', 1, [pieChartInstance], null, null, true, header);
  
      // Reset the chart background color after exporting
      pieChartInstance.background = originalBackgroundColor;
      // Reset the pieChartInstance.beforeExport after exporting
      pieChartInstance.beforeExport = null;
    }
  }
  
  
  
  
  return (
    <div className="mt-10">
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
        
      <ChartsHeader category="Line" title="Reservation Count" />
      
      <div className="w-full">
        
        <ChartComponent
          id="charts"
          ref={(chart) => (chartInstance = chart)}
          primaryXAxis={primaryxAxis}
          primaryYAxis={primaryyAxis}
          chartArea={{ border: { width: 0 } }}
          tooltip={{ enable: true, textStyle: { color: currentMode === 'Dark' ? '#fff' : '#333', fontFamily: 'Poppins, sans-serif' } }}
          legendSettings={{ textStyle: { color: currentMode === 'Dark' ? '#fff' : '#333', fontFamily: 'Poppins, sans-serif' } }}
          background={currentMode === 'Dark' ? '#33373E' : '#fff'}
          titleStyle={titleStyle}
          theme={chartTheme}
        >
          <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Export, Category]} />
       <SeriesCollectionDirective>
  <SeriesDirective
    dataSource={chartData}
    xName="day"
    yName="reservations"
    name="Reservations"
    type="Line"
    marker={{ visible: true, width: 10, height: 10 }}
    dataLabel={{
      visible: true,
      position: 'Top',
      font: {
        fontWeight: '600',
        color: currentMode === 'Dark' ? '#fff' : '#333',
        fontFamily: 'Poppins, sans-serif',
        size: '12px', // Add the font size
      },
    }}
  />
</SeriesCollectionDirective>



        </ChartComponent>
      </div>
     
      <button value="print" onClick={clickHandler.bind(this)}  style={{ backgroundColor: currentColor, borderRadius: '10px', color: 'white' , padding: '10px'}}>
        Export to PDF
      </button>



     



    </div>


    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl h-1000">
          <div>
            <p className="text-white ">Popular vehicle Types</p>
          </div>
          <div className="w-100 h-800">
          <AccumulationChartComponent
    id="piecharts"
    legendSettings={{ textStyle: { color: currentMode === 'Dark' ? '#fff' : '#333', fontFamily: 'Poppins, sans-serif', size: '18px' } }}
    height="full"
    ref={(chart) => (pieChartInstance = chart)}
    background={currentMode === 'Dark' ? '#33373E' : '#fff'}
    tooltip={{ enable: true }}
>
    <Inject services={[AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip, Export]} />
     
      <AccumulationSeriesCollectionDirective>
        <AccumulationSeriesDirective
           name="piecharts"
           dataSource={vehicleStatsData}
           xName="x"
           yName="y"
           innerRadius="40%"
           startAngle={0}
           endAngle={360}
           radius="70%"
           explode
           explodeOffset="10%"
           explodeIndex={2}
           dataLabel={{
             visible: true,
             name: 'text',
             position: 'Inside',
             font: {
               fontFamily: 'Poppins, sans-serif', // Set font family to Poppins
               fontWeight: '600',
               color: currentMode === 'Dark' ? '#fff' : '#333', // Adjust text color based on mode
            },
          }}
        />
      </AccumulationSeriesCollectionDirective>
    </AccumulationChartComponent>
          </div>
          <button value="print" onClick={exportPieChart.bind(this)} style={{ backgroundColor: currentColor, borderRadius: '10px', color: 'white' , padding: '10px'}}>
        Export to PDF
      </button>
        </div>
        
    </div>



  );
};

export default Reports;
