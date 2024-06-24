import React from 'react';
import {
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationLegend,
  PieSeries,
  AccumulationDataLabel,
  Inject,
  AccumulationTooltip
} from '@syncfusion/ej2-react-charts';

import { useStateContext } from '../../contexts/ContextProvider';

const Doughnut = ({ id, data, legendVisiblity, height, name, ref }) => {
  const { currentMode } = useStateContext();

  return (
    <AccumulationChartComponent
      id={id}
      legendSettings={{ textStyle: { color: currentMode === 'Dark' ? '#fff' : '#333', fontFamily: 'Poppins, sans-serif', size: '18px' }} }
      height={height}
      ref={ref}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      tooltip={{ enable: true }}
    >
      <Inject services={[AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip]} />
      <AccumulationSeriesCollectionDirective>
        <AccumulationSeriesDirective
          name={name}
          dataSource={data}
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
  );
};

export default Doughnut;
