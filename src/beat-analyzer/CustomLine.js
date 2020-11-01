import React, { Fragment, useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';

const CustomLine = ({ data }) => {
  const chart = [
    {
      id: Math.random().toString(),
      data: Array.from(data, (x, i) => ({ x: i, y: x })),
    },
  ];
  return (
    <Fragment>
      <div style={{ height: '600px', width: '800px' }}>
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
    </Fragment>
  );
};
export default CustomLine;
