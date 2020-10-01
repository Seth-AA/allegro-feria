import React, { Component } from "react";
import AudioVisualiser from "./AudioVisualiser";
import RealTimeBPMAnalyzer from "realtime-bpm-analyzer";
import "./bpm.style.css";
class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioData: new Uint8Array(0),
      // songData: [],
      bpm: [0],
      currentBPM: 0,
      historial: true,
      oscilograma: true,
      showBpm: true,
    };
    this.indexBuffer = [];
    this.tick = this.tick.bind(this);
    this.fillState = this.fillState.bind(this);
    this.keyDetector = this.keyDetector.bind(this);
  }

  keyDetector(event) {
    switch (event.keyCode) {
      case 49:
        this.setState({ oscilograma: !this.state.oscilograma });
        break;
      case 50:
        this.setState({ historial: !this.state.historial });
        break;
      case 51:
        this.setState({ showBpm: !this.state.showBpm });
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyDetector, false);
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
    this.scriptProcessorNode = this.audioContext.createScriptProcessor(
      4096 * 2 * 2,
      1,
      1
    );
    this.source.connect(this.scriptProcessorNode);
    this.scriptProcessorNode.connect(this.audioContext.destination);
    this.onAudioProcess = new RealTimeBPMAnalyzer({
      scriptNode: {
        bufferSize: 4096 * 4,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1,
      },
      computeBPMDelay: 2000,
      continuousAnalysis: true,
      stabilizationTime: 100000000000,
      pushTime: 600,
      pushCallback: (err, bpm2) => {
            
        if (bpm2 && bpm2.length) {
          console.log(bpm2[0]);
          const firstThreshold = Object.keys(this.onAudioProcess.validPeaks)[0];
          this.indexBuffer.push(
            this.onAudioProcess.validPeaks[firstThreshold].length
          );
          while (this.indexBuffer.length >= 5) {
            const index = this.indexBuffer[0];
            for (let threshold of Object.keys(this.onAudioProcess.validPeaks)) {
              this.onAudioProcess.validPeaks[threshold].splice(0, index);
              break;
            }
            this.indexBuffer = this.indexBuffer.map((idx) => idx - index);
            this.indexBuffer.shift();
          }

          const new_tempo = bpm2[0].tempo;
          let next_tempo = 0;
          const posibles = [1, 2, 4];
          let best = Infinity;
          for (let index = 0; index < posibles.length; index++) {
            const element = posibles[index];
            var di2 = new_tempo * element - this.state.currentBPM;
            if (di2 < best) {
              best = di2;
              next_tempo = new_tempo * element;
            }
          }

          // const diff = (bpm2[0].tempo - this.state.currentBPM) / 4;
          const diff = (next_tempo - this.state.currentBPM) / 4;
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
    this.setState({
      audioData: this.dataArray,
    });
    this.rafId = requestAnimationFrame(this.tick);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  fillState(newState) {
    this.setState(newState);
  }
  render() {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const average = Math.round(
      this.state.bpm.slice(-10).reduce(reducer) /
        Math.min(10, this.state.bpm.length)
    );
    var diff = -this.state.currentBPM + average;
    function clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    }
    const percent = clamp(46 - diff, 0, 100);
    const images = [
      require("./assets/images/turtle.svg"),
      require("./assets/images/rabbit.svg"),
      require("./assets/images/ok.svg"),
    ];
    const image = diff > 10 ? images[0] : diff < -10 ? images[1] : images[2];
    const imageState =
      diff > 10 ? "Estas frenando" : diff < -10 ? "Estas acelerando" : "Bien!";
    diff = Math.round(diff);
    return (
      <div className="col-6 boxed" style={{ margin: "0 auto" }}>
        {this.state.showBpm ? (
          <div
            className="current-bpm"
            style={{
              animation: `pulse ${60 / this.state.currentBPM}s infinite`,
              color: "#dfe6e9",
              marginTop: "4%",
            }}
          >
            {Math.round(this.state.currentBPM)}
            <p style={{ fontSize: "25px", paddingBottom: "5px" }}>BPM</p>
          </div>
        ) : (
          ""
        )}

        <div className="medidor">
          <div
            className="outline"
            style={{
              position: "relative",
              left: `${percent}%`,
              display: "inline-block",
              textAlign: "center",
              height: "auto",
            }}
          >
            {this.state.bpm.length > 1 ? (
              <img
                width="50px"
                height="50px"
                src={image}
                alt="Italian Trulli"
              ></img>
            ) : (
              ""
            )}
          </div>
          {this.state.bpm.length > 1 ? (
            <p style={{ textAlign: "center" }}>{imageState}</p>
          ) : (
            <p style={{ textAlign: "center", paddingTop: "25px" }}>
              {"Procesando ritmo..."}
            </p>
          )}
        </div>
        {this.state.historial ? (
          <div className="flex-row boxed panel-history">
            {this.state.bpm
              .slice(-14)
              .reverse()
              .map((number, index) => (
                <div className="bpm-info history">{number}</div>
              ))}
          </div>
        ) : (
          ""
        )}

        <div className="">
          {this.state.oscilograma ? (
            <AudioVisualiser audioData={this.state.audioData} />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

AudioAnalyser.defaultProps = {
  oscilograma: true,
  his: true,
};
export default AudioAnalyser;
