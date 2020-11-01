import React, { Fragment, useState, useEffect, useRef } from 'react';

const Visualiser = ({ mediaStream }) => {
  const [dataArray, setDataArray] = useState(new Uint8Array([]));

  useEffect(() => {
    const updateArray = () => {
      let tempArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(tempArray);
      setDataArray(tempArray);
      rafId = requestAnimationFrame(updateArray);
    };
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(mediaStream);
    const analyser = audioContext.createAnalyser();
    let rafId;
    source.connect(analyser);
    rafId = requestAnimationFrame(updateArray);
    return () => {
      source.disconnect(analyser);
      cancelAnimationFrame(rafId);
    };
  }, [mediaStream]);

  return (
    <Fragment>
      <Oscilogram data={dataArray} />
    </Fragment>
  );
};
export default Visualiser;

const Oscilogram = ({ data }) => {
  const refCanvas = useRef();

  useEffect(() => {
    let canvas = refCanvas.current;
    let context = canvas.getContext('2d');
    let x = 0.0;
    const height = canvas.height;
    const width = canvas.width;
    const size = data.length;
    const sliceWidth = (width * 1.0) / size;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = '#000000';
    context.lineTo(0, height / 2);

    for (const item of data) {
      const y = 100 * (item / 255);
      context.lineTo(x, y);
      x += sliceWidth;
    }

    context.lineTo(width, height / 2);
    context.stroke();
  }, [data]);

  return (
    <Fragment>
      <canvas width='400' height='100' ref={refCanvas}></canvas>
    </Fragment>
  );
};
