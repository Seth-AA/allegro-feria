import React, { useState, useMemo, useRef } from "react";
import PoseNet from "react-posenet";
import "./Posture.css";
import {
    edgePoint,
    Error,
    drawSkeleton,
    Evaluation,
    EvalHead,
    EvalMsg,
    correctPos,
} from "./Posture_utils.js";
import { Container, Row, Col } from "react-bootstrap";
import "./Posture.css";

function correctPointsViolin(posesJson, lefty) {
    const points = posesJson.keypoints;
    var correctPoints = {
        score: posesJson.score,
        keypoints: [],
    };
    if (lefty) {
        points.forEach((element, index) => {
            var x, y;
            if (element.part == "leftShoulder") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightShoulder";
                });
                x = element.position.x;
                y = point1[0].position.y;
                correctPoints.keypoints.push({
                    position: { x, y },
                    part: "leftShoulder",
                    score: 1,
                });
            } else if (element.part == "rightElbow") {
                const pointW = posesJson.keypoints.filter((part) => {
                    return part.part == "rightWrist";
                });
                const pointS = posesJson.keypoints.filter((part) => {
                    return part.part == "rightShoulder";
                });
                if (pointW[0].part.y < pointS[0].position.y) {
                    x = element.position.x;
                    y = element.position.y + 70;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "rightElbow",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else if (element.part == "rightWrist") {
                const pointS = posesJson.keypoints.filter((part) => {
                    return part.part == "rightShoulder";
                });
                if (element.position.y - pointS[0].position.x > 30) {
                    x = element.position.x;
                    y = pointS[0].position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "rightWrist",
                        score: 1,
                    });
                } else if (element.position.x > pointS[0].position.x) {
                    x = 2 * pointS[0].position.x - element.position.x;
                    y = element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "rightWrist",
                        score: 1,
                    });
                } else if (element.position.y < pointS[0].position.y) {
                    x = element.position.x;
                    y = pointS[0].position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "rightWrist",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else if (element.part == "leftElbow") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "leftShoulder";
                });
                if (element.position.y < point1[0].position.y) {
                    x = element.position.x;
                    y = 2 * point1[0].position.y - element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "leftElbow",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else if (element.part == "leftWrist") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "nose";
                });
                const point2 = posesJson.keypoints.filter((part) => {
                    return part.part == "leftElbow";
                });
                if (element.position.y < point1[0].position.y) {
                    x = element.position.x;
                    y = 519 - element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "leftWrist",
                        score: 1,
                    });
                } else if (element.position.x > point2[0].position.x) {
                    x = 2 * point2[0].position.x - element.position.x;
                    y = element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "leftWrist",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else {
                correctPoints.keypoints.push(element);
            }
        });
    } else {
        points.forEach((element, index) => {
            var x, y;
            if (element.part == "rightShoulder") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "leftShoulder";
                });
                x = element.position.x;
                y = point1[0].position.y;
                correctPoints.keypoints.push({
                    position: { x, y },
                    part: "rightShoulder",
                    score: 1,
                });
            } else if (element.part == "leftElbow") {
                const pointW = posesJson.keypoints.filter((part) => {
                    return part.part == "leftWrist";
                });
                const pointS = posesJson.keypoints.filter((part) => {
                    return part.part == "leftShoulder";
                });
                if (pointW[0].part.y < pointS[0].position.y) {
                    x = element.position.x;
                    y = element.position.y + 70;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "leftElbow",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else if (element.part == "leftWrist") {
                const pointS = posesJson.keypoints.filter((part) => {
                    return part.part == "leftShoulder";
                });
                if (element.position.y - pointS[0].position.x > 30) {
                    x = element.position.x;
                    y = pointS[0].position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "leftWrist",
                        score: 1,
                    });
                } else if (element.position.x < pointS[0].position.x) {
                    x = 2 * pointS[0].position.x - element.position.x;
                    y = element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "leftWrist",
                        score: 1,
                    });
                } else if (element.position.y < pointS[0].position.y) {
                    x = element.position.x;
                    y = pointS[0].position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "leftWrist",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else if (element.part == "rightElbow") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightShoulder";
                });
                if (element.position.y < point1[0].position.y) {
                    x = element.position.x;
                    y = 2 * point1[0].position.y - element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "rightElbow",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else if (element.part == "rightWrist") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "nose";
                });
                const point2 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightElbow";
                });
                if (element.position.y < point1[0].position.y) {
                    x = element.position.x;
                    y = 519 - element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "rightWrist",
                        score: 1,
                    });
                } else if (element.position.x < point2[0].position.x) {
                    x = 2 * point2[0].position.x - element.position.x;
                    y = element.position.y;
                    correctPoints.keypoints.push({
                        position: { x, y },
                        part: "rightWrist",
                        score: 1,
                    });
                } else {
                    correctPoints.keypoints.push(element);
                }
            } else {
                correctPoints.keypoints.push(element);
            }
        });
    }

    correctPoints.keypoints = correctPoints.keypoints.reduce((unique, o) => {
        if (!unique.some((obj) => obj.part === o.part)) {
            unique.push(o);
        }
        return unique;
    }, []);
    return correctPoints;
}

function correctPointsGuitar(posesJson, lefty) {
    const points = posesJson.keypoints;
    var correctPoints = {
        score: posesJson.score,
        keypoints: [],
    };
    if (lefty) {
        points.forEach((element, index) => {
            if (element.part == "rightWrist") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "leftWrist";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 310, 190, 202, 242, lefty)
                );
            } else if (element.part == "rightElbow") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "leftElbow";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 276, 236, 144, 217, lefty)
                );
            } else if (element.part == "rightKnee") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "leftKnee";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 354, 362, 79, 514, lefty)
                );
            } else if (element.part == "rightAnkle") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightAnkle";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 323, 574, 168, 655, lefty)
                );
            } else {
                correctPoints.keypoints.push(element);
            }
        });
    } else {
        points.forEach((element, index) => {
            if (element.part == "leftWrist") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightWrist";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 310, 190, 202, 242, lefty)
                );
            } else if (element.part == "leftElbow") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightElbow";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 276, 236, 144, 217, lefty)
                );
            } else if (element.part == "leftKnee") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightKnee";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 354, 362, 79, 514, lefty)
                );
            } else if (element.part == "leftAnkle") {
                const point1 = posesJson.keypoints.filter((part) => {
                    return part.part == "rightAnkle";
                });
                correctPoints.keypoints.push(
                    correctPos(point1[0], element, 323, 574, 168, 655, lefty)
                );
            } else {
                correctPoints.keypoints.push(element);
            }
        });
    }
    return correctPoints;
}

function correctPoints(posesJson, instrumento, lefty) {
    if (instrumento.instrumento == "VIOLIN") {
        return correctPointsViolin(posesJson, lefty);
    } else if (instrumento.instrumento == "GUITAR") {
        return correctPointsGuitar(posesJson, lefty);
    }
}

function Posture() {
    const [H, setH] = useState(600);
    const [W, setW] = useState(450);

    const [lefty, setLefty] = useState(false);

    const [posesJson, setPosesJson] = useState({
        score: 0,
        keypoints: [{ position: { x: 0, y: 0 }, part: "null", score: 0 }],
    });
    const [correctPosesJson, setCorrectPosesJson] = useState({
        score: 0,
        keypoints: [{ position: { x: 0, y: 0 }, part: "correct", score: 0 }],
    });

    const [errorJson, setErrorJson] = useState({ error: -1, keypoints: [] });

    const example = useMemo(() => {
        const image = new Image();
        image.crossOrigin = "";
        image.src = require("../assets/images/example.jpg");
        return image;
    }, []);

    const [posesImage, setPosesImage] = useState(example);
    const [selectedImage, setSelectedImage] = useState("Seleccione una imagen");

    const handleChange = (e) => {
        if (e.target.files.length) {
            const image = new Image();
            image.crossOrigin = "";
            image.src = URL.createObjectURL(e.target.files[0]);
            setSelectedImage(e.target.files[0].name);
            setPosesImage(image);

            setH(posesImage.height);
            setW(posesImage.width);
            canvasRef.current.getContext("2d").clearRect(0, 0, W, H);
            correctRef.current.getContext("2d").clearRect(0, 0, W, H);
        }
    };

    const handleSkeleton = (witdh, height) => {
        var checkBox = document.getElementById("skeletonCheck");
        if (checkBox.checked == true) {
            drawSkeleton(
                posesJson.keypoints,
                0.5,
                canvasRef.current.getContext("2d"),
                witdh,
                height
            );
        } else {
            canvasRef.current.getContext("2d").clearRect(0, 0, W, H);
        }
    };
    const handleSuges = (witdh, height) => {
        var checkBox = document.getElementById("sugesCheck");
        if (checkBox.checked == true) {
            drawSkeleton(
                correctPosesJson.keypoints,
                0.5,
                correctRef.current.getContext("2d"),
                witdh,
                height,
                "orange"
            );
        } else {
            correctRef.current.getContext("2d").clearRect(0, 0, W, H);
        }
    };

    const canvasRef = useRef(null);
    const correctRef = useRef(1);

    const [instrumento, setInstrumento] = useState({ instrumento: "GUITAR" });

    /*
    
    const [detalles, setDetalles] = useState(false);
                        <div className="custom-control custom-checkbox">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                id="detallesCheck"
                                onClick={(e) => {
                                    setDetalles(!detalles);
                                }}
                            />
                            <label
                                className="custom-control-label"
                                for="detallesCheck"
                            >
                                Mostrar detalles
                            </label>
                        </div>
                        {detalles ? Coordinates(posesJson) : ""}
*/

    return (
        <Container fluid>
            <Row>
                <Col md={4}>
                    <div className="pretty_container_left options">
                        <h4>Opciones</h4>
                        <div className="custom-file asd">
                            <input
                                className="custom-file-input"
                                type="file"
                                id="upload-button"
                                onChange={handleChange}
                            />
                            <label
                                className="custom-file-label"
                                for="upload-button"
                            >
                                {selectedImage}
                            </label>
                        </div>
                        <p> Instrumento:</p>
                        <div className="radiob">
                            <input
                                type="radio"
                                id="Guitarra"
                                name="ins"
                                value="Guitarra"
                                defaultChecked={true}
                                onClick={(e) => {
                                    setInstrumento({
                                        instrumento: "GUITAR",
                                    });
                                }}
                            />
                            <label for="Guitarra">Guitarra</label>
                            <br />
                            <input
                                type="radio"
                                id="Violin"
                                name="ins"
                                value="Violin"
                                onClick={(e) => {
                                    setInstrumento({
                                        instrumento: "VIOLIN",
                                    });
                                }}
                            />
                            <label for="Violin">Violin</label>
                        </div>
                        <p> Tipo de postura:</p>
                        <div className="radiob">
                            <input
                                type="radio"
                                id="Diestra"
                                name="gender"
                                value="Diestra"
                                defaultChecked={true}
                                onClick={(e) => {
                                    setLefty(false);
                                }}
                            />
                            <label for="Diestra">Diestra</label>
                            <br />
                            <input
                                type="radio"
                                id="Zurda"
                                name="gender"
                                value="Zurda"
                                onClick={(e) => {
                                    setLefty(true);
                                }}
                            />
                            <label for="Zurda">Zurda</label>
                        </div>
                        <div className="custom-control custom-checkbox">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                id="skeletonCheck"
                                onClick={(e) => {
                                    handleSkeleton(W, H);
                                }}
                            />
                            <label
                                className="custom-control-label"
                                for="skeletonCheck"
                            >
                                Marcar postura propia
                            </label>
                        </div>
                        <div className="custom-control custom-checkbox">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                id="sugesCheck"
                                onClick={(e) => {
                                    handleSuges(W, H);
                                }}
                            />
                            <label
                                className="custom-control-label"
                                for="sugesCheck"
                            >
                                Mostrar sugerencia
                            </label>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div class="img-overlay-wrap">
                        <PoseNet
                            input={posesImage}
                            height={H}
                            width={W}
                            inferenceConfig={{
                                decodingMethod: "single-person",
                                architecture: "ResNet50",
                                outputStride: 32,
                                quantBytes: 4,
                            }}
                            onEstimate={(poses) => {
                                try {
                                    setPosesJson(poses[0]);
                                    const newCP = correctPoints(
                                        poses[0],
                                        instrumento,
                                        lefty
                                    );
                                    setCorrectPosesJson(newCP);
                                    setErrorJson(Error(poses[0], newCP));
                                } catch (error) {
                                    setPosesJson({
                                        score: 0,
                                        keypoints: [],
                                    });
                                    setCorrectPosesJson({
                                        score: 0,
                                        keypoints: [],
                                    });
                                    setErrorJson({
                                        error: -1,
                                        keypoints: [],
                                    });
                                }
                            }}
                        />
                        <svg height={H} width={W}>
                            <rect
                                x={edgePoint(posesJson, "x", "min")}
                                y={edgePoint(posesJson, "y", "min")}
                                width={
                                    edgePoint(posesJson, "x", "max") -
                                    edgePoint(posesJson, "x", "min")
                                }
                                height={
                                    edgePoint(posesJson, "y", "max") -
                                    edgePoint(posesJson, "y", "min")
                                }
                                fill="None"
                                stroke={Evaluation(errorJson, 20)}
                                stroke-width={5}
                            />
                        </svg>
                        <canvas ref={canvasRef} width={W} height={H} />
                        <canvas ref={correctRef} width={W} height={H} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Posture;
