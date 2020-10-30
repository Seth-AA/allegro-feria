import React, { Component, useState } from "react";
import Chord from '@tombatossals/react-chords/lib/Chord'
import DBC from './DBC.json' 
import "./Chords.css";

import { Row, Col, Container } from "react-bootstrap";


function Chords (){
    const findChords = (root,suf) =>{
        const acorde = DBC.chords[root].filter((chord, index) => {return chord.suffix == suf})
        return acorde[0];
    }
    const drawChords = (root, suf) => {
        const listChord = findChords(root, suf);
        const instrument = {
            strings: 6,
            fretsOnChord: 4,
            name: 'Guitar',
            keys: [],
            tunings: {
                standard: ['E', 'A', 'D', 'G', 'B', 'E']
            }
        }
        const lite = false // defaults to false if omitted
        return  <div className="acordes">   
                    {
                        listChord.positions.map((chord, index) => 
                            {
                                return <Chord
                                                chord={chord}
                                                instrument={instrument}
                                                lite={lite}
                                        />
                            })  
                    }
                </div>
    }

    return  <Container>
                <div className="catalogo">
                    <Row>
                    </Row>
                        {drawChords("B","major")}
                </div>
            </Container>
}

export default Chords;