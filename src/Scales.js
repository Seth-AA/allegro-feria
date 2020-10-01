import React, { Component, useState } from "react";
import Fretboard, { chordNotes, scaleNotes } from 'react-fretboard'
import custom from "./theme"


class Scales extends Component{

  constructor(props) {
    super(props);
    this.state = {
      note: "E",
      scale: "phrygian"
      };
  

      this.handleNote = this.handleNote.bind(this);
      this.handleScale = this.handleScale.bind(this);
    
  }

  handleNote(event) {
    this.setState({note: event.target.value });

  }
  handleScale(event) {
    this.setState({scale: event.target.value});
  }


  render() {
    return (


      <div>

      <form onSubmit={this.handleSubmit}>
        <label>
          ELije una nota:
          <select value={this.state.note} onChange={this.handleNote}>
            <option value="E">E</option>
            <option value="C">C</option>
            <option value="B">D</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="A">A</option>
          </select>
        </label>

        <label>
          Elije una escala:
          <select value={this.state.scale} onChange={this.handleScale}>
            <option value="phrygian">phrygian</option>
            <option value="dorian">dorian</option>
            <option value="ionian">ionian</option>
            <option value="lydian">lydian</option>
            <option value="mixolydian">mixolydian</option>
            <option value="aeolian">aeolian</option>
            <option value="locrian">locrian</option>
          </select>
        </label>
      </form>
      <Fretboard
        theme={custom}
        nrOfFrets={12}
        skinType="strings"
        selectedNotes={ scaleNotes(this.state.note, this.state.scale)}
      />
    </div>
    );
}
}

  

export default Scales
