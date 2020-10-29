import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';
import React, { Fragment, useState, useEffect } from 'react';

const AudioScript = ({ audio, pushCall }) => {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(audio);
    let scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
    scriptProcessorNode.connect(audioContext.destination);
    source.connect(scriptProcessorNode);
    const onAudioProcess = new RealTimeBPMAnalyzer({
      scriptNode: {
        bufferSize: 4096 * 4,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1,
      },
      continuousAnalysis: true,
      pushTime: 2000,
      pushCallback: (err, bpm) => {
        if (mounted && bpm && bpm.length) {
          pushCall(bpm);
        }
      },
    });
    scriptProcessorNode.onaudioprocess = (e) => {
      onAudioProcess.analyze(e);
    };

    return () => {
      setMounted(false);
      scriptProcessorNode.onAudioProcess = () => '';
      console.log('destroyed audioScript');
      source.disconnect();
    };
  }, []);
  return <Fragment></Fragment>;
};
export default AudioScript;
