import React, { useState, useEffect, Fragment } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AudioAnalyser from './AudioAnalyser';

const Bpm = () => {
  const [audio, setAudio] = useState(null);

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
  return (
    <Fragment>
      <div>
        {this.state.audio ? (
          ''
        ) : (
          <div className='col-6 boxed' style={{ margin: '0 auto', height: '622px' }}>
            <div
              className='current-bpm'
              style={{
                color: '#dfe6e9',
                marginTop: '4%',
              }}
            >
              0
              <p
                style={{
                  fontSize: '25px',
                  paddingBottom: '5px',
                }}
              >
                BPM
              </p>
            </div>
            <div className='medidor'>
              <div
                className='outline'
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  textAlign: 'center',
                  height: 'auto',
                }}
              ></div>
            </div>
            <div className='flex-row boxed panel-history'> </div>
            <svg height='100' width='440'>
              <line x1='0' y1='50' x2='440' y2='50' />
            </svg>
          </div>
        )}
      </div>
      <div
        className='col-6'
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '0 auto',
        }}
      >
        <Button style={{ margin: '10px' }} variant='success' onClick={getMic} disabled={audio}>
          Comenzar
        </Button>
        <Button style={{ margin: '10px' }} variant='danger' onClick={stopMic} disabled={!audio}>
          Detener
        </Button>
      </div>
    </Fragment>
  );
};
