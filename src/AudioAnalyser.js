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
        this.tick = this.tick.bind(this);
        this.fillState = this.fillState.bind(this);
        this.keyDetector = this.keyDetector.bind(this);
    }

    //Esta función re-renderiza
    // "no influye en la detección de bpm"
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

    //Esta función re-renderiza
    componentDidMount() {
        document.addEventListener("keydown", this.keyDetector, false);
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();

        //ahi dice "bin"
        this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
        this.source = this.audioContext.createMediaStreamSource(
            this.props.audio
        );
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
            // estos son solo parametros
            scriptNode: {
                bufferSize: 4096 * 2 * 2,
                numberOfInputChannels: 1,
                numberOfOutputChannels: 1,
            },
            
            // Default: 2000,
            // idk, pero parece que mayor permite mayor variacion
            stabilizedBpmCount: 20000,
            
            //computeBPMDelay: 1000,
            
            // Default: 10000
            // ni idea que hace... 
            // valores altos, la variacion es pequeña y no parece funcionar muy bien 1000000
            // valores bajor, la variacion es mayor, pero la precicion tampoco es alta 100
            computeBPMDelay: 20000,

            // Default: 20000
            //tiempo en que demora en estabilizarse?
            // tiempo en que demora en cambiar:
            // valores grandes cambia mucho, valores pequeños cambia poco
            stabilizationTime: 1000000000000000,
            
            
            continuousAnalysis: true,

            //pushTime: 600,
            // Default: 2000
            pushTime: 700,        
            
            pushCallback: (err, bpm2) => {
                if (bpm2 && bpm2.length) {
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

                    //Aqui re-renderiza !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                    this.setState({
                        // el bpm ahora es todo lo anterior + el "currentBPM"
                        bpm: [
                            ...this.state.bpm,
                            Math.round(this.state.currentBPM),
                        ],
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

    //Esta función re-renderiza
    // Por lo que se ve esta solo es una función de animación,
    // no afecta al bpm
    tick() {
        this.analyser.getFloatTimeDomainData(this.dataArray);
        this.setState({
            audioData: this.dataArray,
        });
        this.rafId = requestAnimationFrame(this.tick);
    }

    //No afecta bpm
    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    //Esta función re-renderiza
    fillState(newState) {
        this.setState(newState);
    }


    render() {
        // reducer es una funcion implicita que suma los dos valores de entrada
        const reducer = (accumulator, currentValue) =>
            accumulator + currentValue;

        const avg_history_size = 4;

        //es el promedio de los ultimos 10 valores 
        const average = Math.round(
            //bpm es un arreglo inicializado: [0]
            // un .reduce aplica una función "reductora" a un arreglo entregando un solo valor
            // en este caso entrega la suma de los ultimos 10 valores
            // y lo divide entre el largo del arreglo bpm o avg_history_size
            this.state.bpm.slice(-avg_history_size).reduce(reducer) /
                Math.min(avg_history_size, this.state.bpm.length)
        );
        
        //diff entonces es la diferencia entre el BPM actual y el promedio de las últimas 10 mediciones
        //var diff = this.state.currentBPM - average;
        var diff = average - this.state.currentBPM;

        //funcion para fijar un valor entre dos extremos
        function clamp(num, min, max) {
            return num <= min ? min : num >= max ? max : num;
        }

        // el percent será un número entre 0 y 100
        // ni idea que es 46-diff... ver en que se usa percent
        const percent = clamp(46 - diff, 0, 100);
        const images = [
            require("./assets/images/turtle.svg"),
            require("./assets/images/rabbit.svg"),
            require("./assets/images/ok.svg"),
        ];

        //parametro para hacer las variaciones mas faciles
        const comp = 10;

        //aqui se define cual de las 3 imagenes se usara
        //si la diferencia es mayor a 10, entonces tortuga,
        // si es menor a 10, entonces conejo,
        //sino un ok
        const image =
            diff > comp ? images[0] : diff < -comp ? images[1] : images[2];

        // aqui sucede lo mismo de antes con las imagenes, pero ahora con texto
        const imageState =
            diff > comp
                ? "Estas frenando"
                : diff < -comp
                ? "Estas acelerando"
                : "Bien!";

        //why tf se vuelve a hacer round xd
        diff = Math.round(diff);

        //Vista

        //Literal lo unico relevante que observar aquí abajo es el "this.state.currentBPM"
        return (
            <div className="col-6 boxed" style={{ margin: "0 auto" }}>
                {this.state.showBpm ? ( // Si mostrarlo es true, se muestra, sino ""
                    <div
                        className="current-bpm"
                        style={{
                            animation: `pulse ${
                                60 / this.state.currentBPM //Simplemente usa el BPM actual para "palpitar"
                            }s infinite`,
                            color: "#dfe6e9",
                            marginTop: "4%",
                        }}
                    >
                        {Math.round(this.state.currentBPM)} {/*Es el BPM que se muestra, por defecto es 0*/}
                        <p style={{ fontSize: "25px", paddingBottom: "5px" }}>
                            BPM
                        </p>
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
                            .slice(-12)
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
