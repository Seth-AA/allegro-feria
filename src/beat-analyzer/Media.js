import React, { Fragment, useState, useEffect } from 'react';
import Analyser from './Analyser';
import './Media.css';
import Visualiser from './Visualiser';
import { Button } from 'react-bootstrap';

const Media = (props) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [history, setHistory] = useState([0]);

  useEffect(async () => {
    const tempAudio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setMediaStream(tempAudio);
  }, []);

  const startRecording = () => {
    setHistory([0]);
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const updateHistory = (bpm) => {
    setHistory((prev) => [...prev, bpm]);
  };

  return (
    <Fragment>
      {recording ? <Analyser mediaStream={mediaStream} pushCall={updateHistory} /> : ''}
      <div className='container'>
        <div className='current-bpm'>
          {history.slice(-1)[0]}
          <p className='fmedium'>BPM</p>
        </div>
        <div className='panel-history'>
          {history
            .slice(-16)
            .reverse()
            .map((elem, key) => (
              <div key={key}>{elem}</div>
            ))}
        </div>
        {/* {recording ? <Visualiser mediaStream={mediaStream} /> : ''} */}

        <div>
          <Button
            style={{ margin: '10px' }}
            variant='success'
            onClick={startRecording}
            disabled={recording}
          >
            Comenzar
          </Button>
          <Button
            style={{ margin: '10px' }}
            variant='danger'
            onClick={stopRecording}
            disabled={!recording}
          >
            Detener
          </Button>
        </div>
      </div>
    </Fragment>
  );
};
export default Media;

const CurrentBpm = ({ bpm }) => {
  return (
    <div>
      {bpm}
      <p className='fmedium'>BPM</p>
    </div>
  );
};
