import React, { Fragment, useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import Analyser from './Analyser';
import './Media.css';
import Visualiser from './Visualiser';
import { Button } from 'react-bootstrap';
import Fixed_CustomLine from './Fixed_CustomLine';

const images = [
  require('../assets/images/turtle.svg'),
  require('../assets/images/rabbit.svg'),
  require('../assets/images/ok.svg'),
];

//functions
const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num);
const average = (list) => list.reduce((prev, curr) => prev + curr) / list.length;

const Fixed_Media = (props) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [history, setHistory] = useState([0]);
  const [movement, setMovement] = useState(0);
  const [fixed_bpm, setFixedBPM] = useState(null);

  useEffect(async () => {
    const tempAudio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setMediaStream(tempAudio);
  }, []);

  const startRecording = () => {
    if (fixed_bpm) {
      setHistory([0]);
      setRecording(true);
    } else {
      alert("Debes fijar primero un BPM!");
    }

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

  const handleUpdateFixedBPM = (event) => {
    setFixedBPM(event.target.value);
  }

  //render
  return (
    <Fragment>
      {recording && mediaStream ? (
        <Analyser mediaStream={mediaStream} pushCall={updateHistory} />
      ) : (
        ''
      )}
      <div className="containerBPM">
        <div className="fix_bpm">
          {fixed_bpm ? (
            <BPMForm handleChange={handleUpdateFixedBPM} fixed_bpm={fixed_bpm} current={history.slice(-1)[0]} />
          ) : (
            <BPMForm handleChange={handleUpdateFixedBPM} />
          )}

        </div>
      </div>
      
      <div className='containerBPM'>
        <div>
          <button>
            <Link to="/bpm-analyser">Practicar con un BPM libre</Link>
          </button>
        </div>
        <div className='current-bpm'>
          {history.slice(-1)[0]}
          <p className='fmedium'>BPM</p>
        </div>

        <Medidor history={history} images={images} fixedBPM={fixed_bpm}/>

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
        <Fixed_CustomLine 
          data={history} 
          fixedBPM={Array(history.length).fill(fixed_bpm)}
          />
      ) : (
        ''
      )}
    </Fragment>
  );
};
export default Fixed_Media;

const Medidor = ({ images, history, fixedBPM }) => {
  const mean = fixedBPM;
  const first = history.slice(-1)[0] == 0 ? fixedBPM : history.slice(-1)[0];
  const diff = clamp(mean - first, -40, 40);
  const curImage = diff > 5 ? images[0] : diff < -5 ? images[1] : images[2];
  const curText =
    diff > 5 ? (diff > 10 ? 'Acelera': "Acelera un poco más") : diff < -5 ? (diff < -10 ? 'Ve más lento': "Ve un poco más lento") : 'Bien!';
  return (
    <Fragment>
      <p style={{ textAlign: 'center' }}>{fixedBPM}</p>
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

const BPMForm = ({handleChange, fixed_bpm, current}) => {
  return(
    <Fragment>
      {fixed_bpm ? (
        <p> El BPM escogido como objetivo es: {fixed_bpm} </p>
      ) : (
        ""
      )}
      
      <form>
        <label>
          BPM: {} {/*Los {} sirven para forzar que haya un espacio xd*/}
          {/* {fixed_bpm ? "Escoge un nuevo BPM: " : "Escoge un BPM objetivo: "} {}  */}
          <input type="number" placeholder="60" onChange={handleChange}/>
        </label>
        {/* <button type="submit" value="Submit" onClick={handleChange}> Enviar </button> */}
      </form>

    </Fragment>
  );
};