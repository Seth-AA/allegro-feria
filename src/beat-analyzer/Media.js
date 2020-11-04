import React, { Fragment, useState, useEffect } from 'react';
import Analyser from './Analyser';
import './Media.css';
import Visualiser from './Visualiser';
import { Button } from 'react-bootstrap';
import CustomLine from './CustomLine';

const images = [
  require('../assets/images/turtle.svg'),
  require('../assets/images/rabbit.svg'),
  require('../assets/images/ok.svg'),
];
const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num);
const average = (list) => list.reduce((prev, curr) => prev + curr) / list.length;

const Media = (props) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [history, setHistory] = useState([0]);
  const [movement, setMovement] = useState(0);

  useEffect(async () => {
    const tempAudio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setMediaStream(tempAudio);
  }, []);

  const startRecording = () => {
    setHistory([90]);
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const updateHistory = (bpm) => {
    setHistory((prev) => {
      let direction = clamp(Math.ceil((prev.slice(-1)[0] - bpm) / 4), -10, 10);
      return [...prev, Math.round(prev.slice(-1)[0] - direction, 0)];
    });
    setMovement(average(history.slice(-20)));
  };

  return (
    <Fragment>
      {recording && mediaStream ? (
        <Analyser mediaStream={mediaStream} pushCall={updateHistory} k />
      ) : (
        ''
      )}
      <div className='containerBPM'>
        <div className='current-bpm'>
          {history.slice(-1)[0]}
          <p className='fmedium'>BPM</p>
        </div>

        <Medidor history={history} images={images} />

        <div className='panel-history'>
          {history
            .slice(-16)
            .reverse()
            .map((elem, key) => (
              <div key={key}>{elem}</div>
            ))}
        </div>

        {recording && mediaStream ? <Visualiser mediaStream={mediaStream} /> : ''}

        <div style={{ textAlign: 'center' }}>
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
      {!recording && mediaStream && history.length > 2 ? (
        <CustomLine data={history} />
      ) : (
        ''
      )}
    </Fragment>
  );
};
export default Media;

const Medidor = ({ images, history }) => {
  const mean = average(history.slice(-20));
  const first = history.slice(-1)[0];
  const diff = clamp(mean - first, -40, 40);
  const curImage = diff > 10 ? images[0] : diff < -10 ? images[1] : images[2];
  const curText =
    diff > 10 ? 'Estas frenando' : diff < -10 ? 'Estas acelerando' : 'Bien!';
  return (
    <Fragment>
      <div className='medidor'>
        <img
          className='medidor-image'
          src={curImage}
          style={{
            left: `${(diff / 60) * 50}%`,
          }}
        />
      </div>
      <p style={{ textAlign: 'center' }}>{curText}</p>
      {}
    </Fragment>
  );
};
