import React, { Component } from "react";
import AudioVisualiser from "./AudioVisualiser";
import RealTimeBPMAnalyzer from "realtime-bpm-analyzer";
import "./bpm.style.css";

class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioData: new Uint8Array(0),
      songData: [],
      bpm: [],
      currentBPM: 0,
    };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
    this.scriptProcessorNode = this.audioContext.createScriptProcessor(
      4096 * 2*2,
      1,
      1
    );
    this.source.connect(this.scriptProcessorNode);
    this.scriptProcessorNode.connect(this.audioContext.destination);
    this.onAudioProcess = new RealTimeBPMAnalyzer({
      scriptNode: {
        bufferSize: 4096 * 2*2,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1,
      },
      computeBPMDelay: 1000,
      // stabilizationTime: 100,
      continuousAnalysis: true,
      // pushTime: 1000,
      pushTime: 500,
      pushCallback: (err, bpm2) => {
        if (bpm2 && bpm2.length) {
          const diff = (bpm2[0].tempo - this.state.currentBPM) / 4;
          this.setState({
            bpm: [...this.state.bpm, Math.round(this.state.currentBPM)],
            currentBPM: this.state.currentBPM
              ? this.state.currentBPM + diff
              : bpm2[0].tempo,
          });
        }
      },
    });
    this.scriptProcessorNode.onaudioprocess = (e) => {
      this.onAudioProcess.analyze(e);
    };
  }

  tick() {
    this.analyser.getFloatTimeDomainData(this.dataArray);
    // this.setState({
    //   songData: Array.from(this.state.songData).concat(
    //     Array.from(this.dataArray).slice(-100)
    //   ),
    // });
    this.setState({
      audioData: this.dataArray,
      // songData: this.state.songData,
    });
    this.rafId = requestAnimationFrame(this.tick);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }
  render() {
    return (
      <div className="flex-row">
        <AudioVisualiser
          audioData={this.state.audioData}
          // songData={this.state.songData}
        />

        <div className="flex-row" style={{ width: "40%" }}>
          {this.state.bpm
            .slice(-20)
            .reverse()
            .map((number, index) => (
              <div className="bpm-info">{number}</div>
            ))}
        </div>
        <div
          className="current-bpm"
          style={{ animation: `pulse ${60/this.state.currentBPM}s infinite` }}
        >
          {Math.round(this.state.currentBPM)}
        </div>
      </div>
    );
  }
}

export default AudioAnalyser;
