import React, { Fragment, useEffect } from 'react';
import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';

const Analyser = ({ mediaStream, pushCall }) => {
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(mediaStream);
    const scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
    let indexBuffer = [];
    let onAudioProcess = new RealTimeBPMAnalyzer({
      scriptNode: {
        bufferSize: 4096,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1,
      },
      // computeBPMDelay: 4000,
      continuousAnalysis: true,
      // stabilizationTime: 50000,
      pushTime: 1000,
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
