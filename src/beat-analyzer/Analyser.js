import React, { Fragment, useState, useEffect } from 'react';
import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';

const Analyser = ({ mediaStream, pushCall }) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const scriptProcessorNode = audioContext.createScriptProcessor(4096 * 4, 1, 1);

  useEffect(() => {
    let onAudioProcess = new RealTimeBPMAnalyzer({
      scriptNode: {
        bufferSize: 4096 * 4,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1,
      },
      computeBPMDelay: 2000,
      continuousAnalysis: true,
      stabilizationTime: 100000000000,
      pushTime: 600,
      pushCallback: (err, bpm) => {
        if (bpm) pushCall(bpm[0].tempo);
      },
    });
    source.connect(scriptProcessorNode);
    scriptProcessorNode.connect(audioContext.destination);
    console.log(mediaStream);
    scriptProcessorNode.onaudioprocess = (e) => {
      onAudioProcess.analyze(e);
    };
    return () => {
      console.log('cleaning analyser');
      source.disconnect();
      scriptProcessorNode.disconnect();
      scriptProcessorNode.onAudioProcess = null;
    };
  }, []);

  return <Fragment></Fragment>;
};
export default Analyser;
