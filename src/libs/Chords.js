import React, { Component, useState } from 'react';
import Select from 'react-select';
import Chord from '@tombatossals/react-chords/lib/Chord';
import DBC from './DBC.json';
import './Chords.css';
import ReactLoading from 'react-loading';
import { Row, Col, Container, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

const options = [
  { value: 'Todos', label: 'Todos' },
  { value: 'major', label: 'mayor' },
  { value: 'minor', label: 'menor' },
  { value: 'dim', label: 'dim' },
  { value: 'dim7', label: 'dim7' },
  { value: 'sus2', label: 'sus2' },
  { value: 'sus4', label: 'sus4' },
  { value: 'sus2sus4', label: 'sus2sus4' },
  { value: '7sus4', label: '7sus4' },
  { value: '7/G', label: '7/G' },
  { value: 'alt', label: 'alt' },
  { value: 'aug', label: 'aug' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '69', label: '69' },
  { value: '7', label: '7' },
  { value: '7b5', label: '7♭5' },
  { value: 'aug7', label: 'aug7' },
  { value: '9', label: '9' },
  { value: '9b5', label: '9♭5' },
  { value: 'aug9', label: 'aug9' },
  { value: '7b9', label: '7♭9' },
  { value: '7#9', label: '7#9' },
  { value: '11', label: '11' },
  { value: '9#11', label: '9#11' },
  { value: '13', label: '13' },
  { value: 'maj7', label: 'maj7' },
  { value: 'maj7b5', label: 'maj7♭5' },
  { value: 'maj7#5', label: 'maj7#5' },
  { value: 'maj9', label: 'maj9' },
  { value: 'maj11', label: 'maj11' },
  { value: 'maj13', label: 'maj13' },
  { value: 'm6', label: 'm6' },
  { value: 'm69', label: 'm69' },
  { value: 'm7', label: 'm7' },
  { value: 'm7b5', label: 'm7♭5' },
  { value: 'm9', label: 'm9' },
  { value: 'm11', label: 'm11' },
  { value: 'mmaj7', label: 'mmaj7' },
  { value: 'mmaj7b5', label: 'mmaj7♭5' },
  { value: 'mmaj9', label: 'mmaj9' },
  { value: 'mmaj11', label: 'mmaj11' },
  { value: 'add9', label: 'add9' },
  { value: 'madd9', label: 'madd9' },
  { value: '/E', label: '/E' },
  { value: '/F', label: '/F' },
  { value: '/F#', label: '/F# /G♭' },
  { value: '/G', label: '/G' },
  { value: '/G#', label: '/G# /A♭' },
  { value: '/A', label: '/A' },
  { value: '/Bb', label: '/A# /B♭' },
  { value: '/B', label: '/B' },
  { value: '/C', label: '/C' },
  { value: '/C#', label: '/C# /D♭' },
  { value: 'm/B', label: 'm/B' },
  { value: 'm/C', label: 'm/C' },
  { value: 'm/C#', label: 'm/C# m/D♭' },
  { value: '/D', label: '/D' },
  { value: 'm/D', label: 'm/D' },
  { value: '/D#', label: '/D# /E♭' },
  { value: 'm/D#', label: 'm/D# m/E♭' },
  { value: 'm/E', label: 'm/E' },
  { value: 'm/F', label: 'm/F' },
  { value: 'm/F#', label: 'm/F# m/G♭' },
  { value: 'm/G', label: 'm/G' },
  { value: 'm/G#', label: 'm/G# m/A♭' },
];

function Chords() {
  const [root, setRoot] = useState('E');
  const [suffix, setSuffix] = useState({ value: 'major', label: 'mayor' });
  const [loaded, setLoaded] = useState(true);

  const handleRoot = (val) => setRoot(val);
  const handleSuffix = (val) => setSuffix(val);

  const findChords = (root, suf) => {
    if (root == 'Todos' && suf == 'Todos') {
      const acorde = DBC.chords;
      return acorde;
    } else if (root == 'Todos' && suf != 'Todos') {
      const acorde = {};
      Object.keys(DBC.chords).map((r, index) => {
        acorde[r] = DBC.chords[r].filter((chord, index) => {
          return chord.suffix == suf;
        });
      });
      return acorde;
    } else if (suf == 'Todos' && root != 'Todos') {
      const acorde = DBC.chords[root];
      return acorde;
    } else {
      const acorde = DBC.chords[root].filter((chord, index) => {
        return chord.suffix == suf;
      });
      return acorde[0];
    }
  };
  const drawChords = (root, suf) => {
    const listChord = findChords(root, suf);
    const instrument = {
      strings: 6,
      fretsOnChord: 4,
      name: 'Guitar',
      keys: [],
      tunings: {
        standard: ['E', 'A', 'D', 'G', 'B', 'E'],
      },
    };
    const lite = false; // defaults to false if omitted
    try {
    } catch (error) {}
    if (root == 'Todos') {
      const divi = (
        <div className='acordes'>
          {Object.keys(listChord).map((r, index) => {
            return listChord[r].map((suffix, index) => {
              return suffix.positions.map((chord, index) => {
                return (
                  <div className='acorde'>
                    <b>{suffix.key + suffix.suffix + ' v' + (index + 1).toString()}</b>
                    <Chord chord={chord} instrument={instrument} lite={lite} />
                  </div>
                );
              });
            });
          })}
        </div>
      );
      return divi;
    } else if (suf == 'Todos' && root != 'Todos') {
      const divi = (
        <div className='acordes'>
          {listChord.map((suffix, index) => {
            return suffix.positions.map((chord, index) => {
              return (
                <div className='acorde'>
                  <b>{suffix.key + suffix.suffix + ' v' + (index + 1).toString()}</b>
                  <Chord chord={chord} instrument={instrument} lite={lite} />
                </div>
              );
            });
          })}
        </div>
      );
      return divi;
    } else {
      let divi = <div className='acordes'></div>;
      try {
        divi = (
          <div className='acordes'>
            {listChord.positions.map((chord, index) => {
              return (
                <div className='acorde'>
                  <b>
                    {listChord.key + listChord.suffix + ' v' + (index + 1).toString()}
                  </b>
                  <Chord chord={chord} instrument={instrument} lite={lite} />
                </div>
              );
            })}
          </div>
        );
      } catch (error) {
        divi = (
          <div className='acordes'>
            <p>{'No se encontraron coincidencias :('}</p>
          </div>
        );
      }

      return divi;
    }
  };

  const customStyles = {
    clearIndicator: (provided, state) => ({
      ...provided,
      color: '#444',
    }),
    noOptionsMessage: (provided, state) => ({
      ...provided,
      color: '#444',
    }),
    menu: (provided, state) => ({
      ...provided,
      borderBottom: '0px',
      color: '#444',
      padding: 0,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    },
  };

  return (
    <Container className='catalogo'>
      <Row>
        <h2 className='title'>Librería de Acordes</h2>
      </Row>
      <Row>
        <ToggleButtonGroup
          type='radio'
          name='options'
          value={root}
          onChange={handleRoot}
          className='notas'
        >
          <ToggleButton value={'Todos'}>Todos</ToggleButton>
          <ToggleButton value={'C'}>C</ToggleButton>
          <ToggleButton value={'Csharp'}>C#/D♭</ToggleButton>
          <ToggleButton value={'D'}>D</ToggleButton>
          <ToggleButton value={'Eb'}>D#/E♭</ToggleButton>
          <ToggleButton value={'E'}>E</ToggleButton>
          <ToggleButton value={'F'}>F</ToggleButton>
          <ToggleButton value={'Fsharp'}>F#/G♭</ToggleButton>
          <ToggleButton value={'G'}>G</ToggleButton>
          <ToggleButton value={'Ab'}>G#/A♭</ToggleButton>
          <ToggleButton value={'A'}>A</ToggleButton>
          <ToggleButton value={'Bb'}>A#/B♭</ToggleButton>
          <ToggleButton value={'B'}>B</ToggleButton>
        </ToggleButtonGroup>
      </Row>
      <Row>
        <Col md={2} className='sufijo'>
          <b>Tipo:</b>
          <Select
            options={options}
            styles={customStyles}
            value={suffix}
            onChange={handleSuffix}
          />
        </Col>
        <Col md={10}>
          {loaded ? (
            drawChords(root, suffix.value)
          ) : (
            <ReactLoading
              type={'spinningBubbles'}
              color={'#2f8bd6'}
              height={'20%'}
              width={'20%'}
              className='spin'
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Chords;
