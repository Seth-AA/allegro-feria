import React, { Fragment, useState, useEffect, useRef } from 'react';

const Visualiser = ({ mediaStream }) => {
  // const refCanvas = useRef();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  const bufferLength = analyser.frequencyBinCount;
  // console.log('buffersize' + bufferLength + 'otra cosa' + analyser.fftSize);
  const [dataArray, setDataArray] = useState(new Float32Array(bufferLength));
  // let tempArray = new Float32Array(bufferLength);

  const updateArray = () => {
    let tempArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(tempArray);
    setDataArray(tempArray);
  };

  // useEffect(() => {
  //   console.log(dataArray.slice(0, 20));
  // }, [dataArray]);

  useEffect(() => {
    const refInterval = setInterval(updateArray, 1000);
    return () => {
      source.disconnect();
      analyser.disconnect();
      // cancelAnimationFrame(requestId);
      clearInterval(refInterval);
    };
  }, []);

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

    console.log(data.slice(0, 20));

    context.lineTo(width, height / 2);
    context.stroke();
  }, [data]);

  return (
    <Fragment>
      <canvas width='400' height='100' ref={refCanvas}></canvas>
    </Fragment>
  );
};
