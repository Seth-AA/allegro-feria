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
    this.getMicrophone = this.getMicrophone.bind(this);
    this.stopMicrophone = this.stopMicrophone.bind(this);
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
      <div>
        <div>
          {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ""}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ margin: "10px" }}
            variant="success"
            onClick={this.getMicrophone}
            disabled={this.state.audio}
          >
            Grabar
          </Button>
          <Button
            style={{ margin: "10px" }}
            variant="danger"
            onClick={this.stopMicrophone}
            disabled={!this.state.audio}
          >
            Detener
          </Button>
        </div>
      </div>
    );
  }
}

export default Bpm;
