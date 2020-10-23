import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';
import React, { Fragment, useState, useEffect } from 'react';

const AudioScript = ({ audio, pushCall }) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(audio);
  const scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
  scriptProcessorNode.connect(audioContext.destination);
  source.connect(scriptProcessorNode);

  const onAudioProcess = new RealTimeBPMAnalyzer({
    scriptNode: {
      bufferSize: 4096 * 4,
      numberOfInputChannels: 1,
      numberOfOutputChannels: 1,
    },
    pushTime: 2000,
    computeBPMDelay: 2000,
    continuousAnalysis: true,
    stabilizationTime: 100000000000,
    pushTime: 600,
    pushCallback: (err, bpm) => {
      if (bpm) {
        pushCall(bpm);
      }
    },
  });
  scriptProcessorNode.onaudioprocess = (e) => {
    onAudioProcess.analyze(e);
  };

  return <Fragment></Fragment>;
};
export default AudioScript;
