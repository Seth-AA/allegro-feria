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
                    {this.state.audio ? (
                        <AudioAnalyser audio={this.state.audio} />
                    ) : (
                        <div
                            className="col-6 boxed"
                            style={{ margin: "0 auto", height: "622px" }}
                        >
                            <div
                                className="current-bpm"
                                style={{
                                    color: "#dfe6e9",
                                    marginTop: "4%",
                                }}
                            >
                                0
                                <p
                                    style={{
                                        fontSize: "25px",
                                        paddingBottom: "5px",
                                    }}
                                >
                                    BPM
                                </p>
                            </div>
                            <div className="medidor">
                                <div
                                    className="outline"
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        textAlign: "center",
                                        height: "auto",
                                    }}
                                ></div>
                            </div>
                            <div className="flex-row boxed panel-history">
                                {" "}
                            </div>
                            <svg height="100" width="440">
                                <line x1="0" y1="50" x2="440" y2="50" />
                            </svg>
                        </div>
                    )}
                </div>
                <div
                    className="col-6"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    <Button
                        style={{ margin: "10px" }}
                        variant="success"
                        onClick={this.getMicrophone}
                        disabled={this.state.audio}
                    >
                        Comenzar
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
