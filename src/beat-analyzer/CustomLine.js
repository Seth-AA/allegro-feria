import React, { Fragment, useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomLine = ({ data }) => {
  const chart = [
    {
      id: Math.random().toString(),
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

  return (
    <Fragment>
      <div style={{ height: '600px', width: '800px' }} className='container-xl bg-info'>
        <ResponsiveLine
          data={chart}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          yScale={{ type: 'linear', min: 60, max: 170, stacked: true, reverse: false }}
          axisTop={null}
          axisRight={null}
          curve='basis'
          pointSize={10}
          lineWidth={2}
          useMesh={true}
          enableGridX={false}
          axisBottom={null}
          enablePoints={chart[0].data.length > 20 ? false : true}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Tiempo',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          theme={{ textColor: 'white' }}
        />
      </div>

      <div class='panel panel-default'>
        <div class='panel-body'>
          <div>Velocidad mas tocada {mode(data)}</div>
        </div>
      </div>

      <div>Mayor tiempo en promedio {longestRender.data}</div>
      <div>Intervalo {data.slice(longestRender.i, longestRender.j).toString()}</div>
    </Fragment>
  );
};
export default CustomLine;
