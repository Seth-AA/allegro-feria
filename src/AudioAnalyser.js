import React, { Component } from "react";
import AudioVisualiser from "./AudioVisualiser";
import RealTimeBPMAnalyzer from "realtime-bpm-analyzer";

class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = { audioData: new Uint8Array(0), songData: [], bpm: 0 };
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
      4096 * 2,
      1,
      1
    );
    // this.source.connect(this.scriptProcessorNode);
    this.analyser.connect(this.scriptProcessorNode);
    this.scriptProcessorNode.connect(this.audioContext.destination);
    // this.source.connect(this.audioContext.destination);
    this.onAudioProcess = new RealTimeBPMAnalyzer({
      scriptNode: {
        bufferSize: 4096 * 2,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1,
      },
      computeBPMDelay: 100,
      // stabilizationTime: 1000,
      continuousAnalysis: true,
      pushTime: 100,
      pushCallback: (err, bpm2) => {
        if (bpm2 && bpm2.length) {
          // console.log(`BPM2: ${bpm2[0].tempo} (${bpm2[0].count})`);
          this.setState({ bpm: bpm2[0].tempo });
        }
      },
    });
    this.scriptProcessorNode.onaudioprocess = (e) => {
      this.onAudioProcess.analyze(e);
    };
  }

  tick() {
    this.analyser.getFloatTimeDomainData(this.dataArray);
    this.setState({
      songData: Array.from(this.state.songData).concat(
        Array.from(this.dataArray).slice(-100)
      ),
    });
    this.setState({
      audioData: this.dataArray,
      songData: this.state.songData,
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
      <FlexRow>
        <div style={{ border: "10px cyan solid !important", width:"500px" }}>
          <AudioVisualiser
            audioData={this.state.audioData}
            songData={this.state.songData}
          />
        </div>
        <div style={{ border: "1px yellow dashed", textAlign: "center", width:"50px", fontSize:"50px"}}>
          {this.state.bpm}
        </div>
      </FlexRow>
    );
  }
}

function FlexRow(props) {
  return (
    <div
      style={{
        alignItems:"center",
        backgroundColor: "green",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
    >
      {props.children}
    </div>
  );
}

export default AudioAnalyser;
