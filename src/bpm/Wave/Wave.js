import React, { Fragment, useState, useEffect, useRef } from 'react';
import { analyze } from 'web-audio-beat-detector';
import AudioVisualiser from '../AudioVisualiser';

const HEIGHT = 600;
const WIDTH = 100;

const Wave = ({ audio }) => {
  return <Fragment>{audio ? <Analyser audio={audio} /> : <Skeleton />}</Fragment>;
};
export default Wave;

const Analyser = ({ audio }) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 128;
  let source, rafId;
  // const [tempArray, setTempArray] = useState(new Float32Array(analyser.frequencyBinCount));
  const [dataArray, setDataArray] = useState(new Uint8Array(0));
  // let tempArray = new Float32Array(analyser.frequencyBinCount);

  const tick = () => {
    let tempArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(tempArray);
    setDataArray(tempArray);
    rafId = requestAnimationFrame(tick);
  };

  useEffect(() => {
    source = audioContext.createMediaStreamSource(audio);
    source.connect(analyser);
    rafId = requestAnimationFrame(tick);
    return () => {
      source.disconnect();
      cancelAnimationFrame(rafId);
      analyser.disconnect();
    };
  }, []);

  return (
    <Fragment>
      <AudioVisualiser audioData={dataArray} />
    </Fragment>
  );
};

const Skeleton = (props) => {
  return <Fragment>Sin audio</Fragment>;
};
