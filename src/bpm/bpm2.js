import React, { useState, useEffect, Fragment, useMemo } from 'react';
import Analyzer from './Analizer2';
import Wave from './Wave/Wave';
import AudioScript from './AudioScript';
import './bpm2.style.css';

const Bpm2 = () => {
  const [audio, setAudio] = useState(null);
  const [bpm, setBpm] = useState(90);
  const [history, setHistory] = useState([0]);

  useEffect(() => {
    console.log(audio);
  }, [audio]);

  const getMic = async () => {
    const tempAudio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setAudio(tempAudio);
  };

  const stopMic = () => {
    audio.getTracks().forEach((track) => track.stop());
    setAudio(null);
  };

  const updateBpm = (newBpm) => {
    setBpm(newBpm[0].tempo);
    const list = history.concat(15);
    setHistory(list);
    console.log(history);
  };

  return (
    <Fragment>
      <div className='container'>
        <div className='current-bpm'>
          {bpm}
          <p className='fmedium'>BPM</p>
        </div>
        <div>bpm bar</div>
        <button onClick={() => updateBpm(15)}>botonazo</button>
        <div className='panel-history'></div>
        <Wave audio={audio}></Wave>
        {audio ? <AudioScript audio={audio} pushCall={updateBpm} /> : ''}
      </div>
      <button onClick={audio ? stopMic : getMic}>{audio ? 'Detener' : 'Grabar'}</button>
    </Fragment>
  );
};

export default Bpm2;
