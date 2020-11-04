import React, { Fragment, useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomLine.styles.css';

const CustomLine = ({ data }) => {
  const chart = [
    {
      id: Math.random().toString(),
      color: '#hsl(18,54,47)',
      data: Array.from(data, (x, i) => ({ x: i, y: x })),
    },
  ];

  const mode = (array) => {
    if (array.length == 0) return null;
    var modeMap = {};
    var maxEl = array[0],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] == null) modeMap[el] = 1;
      else modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  };

  const longest = (array) => {
    let bestFound = 1;
    let si, sj, i, j;
    for (i = 0; i < array.length; i++) {
      const a = array[i];
      let count = 0;
      for (j = i; j < array.length; j++) {
        const b = array[j];
        if (Math.abs(a - b) > 6 || j == array.length - 1) {
          count = j - i;
          break;
        }
      }
      if (count > bestFound) {
        bestFound = count;
        si = i;
        sj = j;
      }
    }
    return { data: bestFound, i: si, j: sj };
  };
  const longestRender = longest(data);
  const repeated = (data.length - [...new Set(data)].length) / data.length;
  const amountOfChanges = [...new Set(data)].length;
  console.log(repeated);

  return (
    <Fragment>
      <div className='grid-container'>
        <div
          style={{ height: '600px', width: '800px' }}
          className='container container-chart'
        >
          <ResponsiveLine
            data={chart}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            yScale={{ type: 'linear', min: 60, max: 170, stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            curve='basis'
            pointSize={10}
            lineWidth={8}
            useMesh={true}
            enableGridX={false}
            axisBottom={null}
            pointColor='#daa72f'
            enablePoints={chart[0].data.length > 20 ? false : true}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Tempo [BPM]',
              legendOffset: -50,
              legendPosition: 'middle',
            }}
            theme={{
              fontSize: '18px',
              textColor: '#c6e6e8',
              grid: { line: { stroke: '#335b6d' } },
            }}
            // colors={{ scheme: 'nivo' }}
            borderColor='#c55a2d'
            isInteractive={false}
          />
        </div>

        <div className='container-chart' style={{ maxWidth: '600px' }}>
          <div className='card-info'>Tempo mas tocado </div>
          <div className='card-info-number'>{mode(data)}[BPM]</div>

          <div className='card-info'>Mejor tiempo tocando constante</div>
          <div className='card-info-number'>{longestRender.data}[s]</div>

          <div className='card-info'>Porcentaje total del tiempo tocando constante </div>
          <div className='card-info-number'>{Math.round(100 * repeated, 2)}%</div>

          <div className='card-info'>Mínimo y Máximo durante la práctica</div>
          <div className='card-info-number'>
            {Math.min(...data)}-{Math.max(...data)}
          </div>

          <div className='card-info'>Cantidad de veces que el Tempo cambió</div>
          <div className='card-info-number'>{amountOfChanges}</div>
        </div>
      </div>
    </Fragment>
  );
};
export default CustomLine;
