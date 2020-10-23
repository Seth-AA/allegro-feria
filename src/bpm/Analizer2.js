import React, { useState, useEffect } from 'react';
import { analyze } from 'web-audio-beat-detector';

const Analyzer2 = (props) => {
  //   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  //   const recorder = new MediaRecorder(props.audio);

  function convertBlobToAudioBuffer(myBlob) {
    const audioContext = new AudioContext();
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      let myArrayBuffer = fileReader.result;
      audioContext.decodeAudioData(myArrayBuffer, (audioBuffer) => {
        analyze(audioBuffer)
          .then((tempo) => {
            console.log(tempo);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    };

    fileReader.readAsArrayBuffer(myBlob);
  }

  const recordAndSend = (stream) => {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = (e) => {
      const blob = new Blob(chunks);
      convertBlobToAudioBuffer(blob);
    };
    setTimeout(() => recorder.stop(), 5000); // we'll have a 5s media file
    recorder.start();
  };

  setInterval(() => recordAndSend(props.audio), 5000);
  return <div></div>;
};

export default Analyzer2;
