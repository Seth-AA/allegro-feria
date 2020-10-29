import React, { useState, useEffect, Fragment, useMemo } from 'react';
// import Analyzer from './Analizer2';
import Wave from './Wave/Wave';
import AudioScript from './AudioScript';
import './bpm2.style.css';

const Bpm2 = () => {
  const [audio, setAudio] = useState(null);
  const [bpm, setBpm] = useState(90);
  const [history, setHistory] = useState([]);

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
    setHistory((prev) => [newBpm[0].tempo, ...prev]);
  };

  return (
    <Fragment>
      <div className='container'>
        <div className='current-bpm'>
          {bpm}
          <p className='fmedium'>BPM</p>
        </div>
        <div>bpm bar</div>
        <div className='panel-history flex flex-wrap'>
          {history.slice(0, 20).map((elem, idx) => (
            <div className='history-item center' key={idx}>
              {elem}
            </div>
          ))}
        </div>
        <Wave audio={audio}></Wave>
        {audio ? <AudioScript key={Math.random()} audio={audio} pushCall={updateBpm} /> : ''}
      </div>
      <button onClick={audio ? stopMic : getMic}>{audio ? 'Detener' : 'Grabar'}</button>
    </Fragment>
  );
};

export default Bpm2;
