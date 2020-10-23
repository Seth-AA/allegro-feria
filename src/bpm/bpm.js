import React, { Component } from 'react';
import AudioAnalyser from './AudioAnalyser';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Line from './Linegraph';
import ExampleData from './ExampleData';

class Bpm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
      globalBpm: [],
    };
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
    this.getMicrophone = this.getMicrophone.bind(this);
    this.stopMicrophone = this.stopMicrophone.bind(this);
    this.appendBpm = this.appendBpm.bind(this);
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

  appendBpm(newBpm) {
    const list = this.state.globalBpm.concat(newBpm);
    this.setState({ globalBpm: list });
    console.log(this.state.globalBpm);
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
        <div style={{ height: '800px' }}>
          <Line data={ExampleData} />
        </div>
        <div>
          {this.state.audio ? (
            <AudioAnalyser audio={this.state.audio} updateParent={this.appendBpm} />
          ) : (
            <div className='col-6 boxed' style={{ margin: '0 auto', height: '622px' }}>
              <div
                className='current-bpm'
                style={{
                  color: '#dfe6e9',
                  marginTop: '4%',
                }}
              >
                0
                <p
                  style={{
                    fontSize: '25px',
                    paddingBottom: '5px',
                  }}
                >
                  BPM
                </p>
              </div>
              <div className='medidor'>
                <div
                  className='outline'
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    textAlign: 'center',
                    height: 'auto',
                  }}
                ></div>
              </div>
              <div className='flex-row boxed panel-history'> </div>
            </div>
          )}
        </div>
        <div
          className='col-6'
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <Button style={{ margin: '10px' }} variant='success' onClick={this.getMicrophone} disabled={this.state.audio}>
            Comenzar
          </Button>
          <Button
            style={{ margin: '10px' }}
            variant='danger'
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
