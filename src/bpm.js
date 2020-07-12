import React, { Component } from "react";
import AudioAnalyser from "./AudioAnalyser";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class Bpm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
    };
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
  }

  async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    this.setState({ audio });
  }

  stopMicrophone() {
    this.state.audio.getTracks().forEach((track) => track.stop());
    this.setState({ audio: null });
  }
  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }

  render() {
    return (
      <div
        className="Bpm"
        style={{
          border: "1px solid pink",
          minHeight: "500px",
          backgroundColor: "yellow",
        }}
      >
        <Button
          style = {{textAlign:"center"}}
          variant={this.state.audio ? "danger" : "success"}
          onClick={this.toggleMicrophone}
        >
          {this.state.audio ? "Deneter" : "Grabar"}
        </Button>

        <div style={{border:"2px red solid", minHeight:"300px"}}>
          {this.state.audio ? (
            <AudioAnalyser audio={this.state.audio} />
          ) : ""}
        </div>
      </div>
    );
  }
}

export default Bpm;
