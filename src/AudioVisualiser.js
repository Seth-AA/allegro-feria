import React, { Component } from "react";
import "./bpm.style.css";

class AudioVisualiser extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }
    render() {
        return (
            <div>
                <canvas
                    // style={{ border: "1px solid black" }}
                    width="400"
                    height="100"
                    ref={this.canvas}
                />
            </div>
        );
    }
    draw() {
        const { audioData } = this.props;
        const canvas = this.canvas.current;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext("2d");
        let x = 0;
        const size = audioData.length;
        // const sliceWidth = (width * 1.0) / songData.length;
        const sliceWidth = (width * 1.0) / size;
        context.lineWidth = 3;
        context.strokeStyle = "#000000";
        context.clearRect(0, 0, width, height);
        context.moveTo(0, height / 2);
        context.beginPath();
        // console.log(audioData);
        for (const item of audioData) {
            const y = item * 1.0 * height + height / 2;
            context.lineTo(x, y);
            x += sliceWidth;
        }
        context.lineTo(x, height / 2);
        context.stroke();
    }
    componentDidUpdate() {
        this.draw();
    }
}

export default AudioVisualiser;
