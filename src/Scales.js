import React, { Component, useState } from "react";
import Fretboard, { chordNotes, scaleNotes } from "react-fretboard";
import { Row, Col, Container } from "react-bootstrap";
import custom from "./theme";
import "./Scale.css";

class Scales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: "E",
            scale: "phrygian",
        };

        this.handleNote = this.handleNote.bind(this);
        this.handleScale = this.handleScale.bind(this);
        this.efe = this.efe.bind(this);
    }

    handleNote(event) {
        this.setState({ note: event.target.value });
    }
    handleScale(event) {
        this.setState({ scale: event.target.value });
    }
    efe(escala) {
        return (
            <div className="huh">
                <b>Notas: </b>
                {escala.map((nota, index) => {
                    return <b>{nota.note}</b>;
                })}
            </div>
        );
    }

    render() {
        return (
            <Container fluid>
                <Row className="sel">
                    <Col md={{ span: 6, offset: 3 }}>
                        <form onSubmit={this.handleSubmit}>
                            <label className="root">
                                Elige una nota:
                                <select
                                    value={this.state.note}
                                    onChange={this.handleNote}
                                >
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="F#">F#/Gb</option>
                                    <option value="G">G</option>
                                    <option value="G#">G#/Ab</option>
                                    <option value="A">A</option>
                                    <option value="A#">A#/Bb</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="C#">C#/Db</option>
                                    <option value="D">D</option>
                                    <option value="D#">D#/Eb</option>
                                </select>
                            </label>

                            <label className="scalo">
                                Elige una escala:
                                <select
                                    value={this.state.scale}
                                    onChange={this.handleScale}
                                >
                                    <option value="phrygian">phrygian</option>
                                    <option value="dorian">dorian</option>
                                    <option value="ionian">ionian</option>
                                    <option value="lydian">lydian</option>
                                    <option value="mixolydian">
                                        mixolydian
                                    </option>
                                    <option value="aeolian">aeolian</option>
                                    <option value="locrian">locrian</option>
                                </select>
                            </label>
                        </form>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <Fretboard
                            theme={custom}
                            nrOfFrets={12}
                            skinType="strings"
                            selectedNotes={scaleNotes(
                                this.state.note,
                                this.state.scale
                            )}
                        />
                    </Col>
                </Row>
                <Row className="frotb">
                    <Col md={{ span: 8, offset: 2 }}>
                        {this.efe(
                            scaleNotes(this.state.note, this.state.scale)
                        )}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Scales;
