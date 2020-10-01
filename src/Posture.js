import React, { useState, useRef, useEffect } from "react";
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
    distance,
    Coordinates,
} from "./Posture_utils.js";

import { Container, Row, Col, Button } from "react-bootstrap";

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
                correctPoints.keypoints.push(//514
                    correctPos(point1[0], element, 354, 362, 79, 460, lefty)
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
                correctPoints.keypoints.push(//514
                    correctPos(point1[0], element, 354, 362, 79, 460, lefty)
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

function Posture(instrumento) {
    const [H, setH] = useState(519);
    const [W, setW] = useState(692);
    let theta;
    if (instrumento.instrumento == "GUITAR") {
        theta = 25;
    } else {
        theta = 0;
    }

    const [lefty, setLefty] = useState(false);

    const [posesJson, setPosesJson] = useState({ score: 0, keypoints: [] });

    const [correctPosesJson, setCorrectPosesJson] = useState({
        score: 0,
        keypoints: [],
    });

    const [errorJson, setErrorJson] = useState({ error: -1, keypoints: [] });

    const [skeletonWatch, setSkeletonWatch] = useState(false);
    const [skeletonSuges, setSkeletonSuges] = useState(true);

    const canvasRef = useRef(null);
    const correctRef = useRef(1);

    const [showCuadrado, setShowCuadrado] = useState(true);

    const handleSkeleton = () => {
        var checkBox = document.getElementById("skeletonCheck");
        if (checkBox.checked == true) {
            setSkeletonWatch(true);
        } else {
            canvasRef.current.getContext("2d").clearRect(0, 0, W, H);
            setSkeletonWatch(false);
        }
    };

    const handleSuges = () => {
        var checkBox = document.getElementById("sugesCheck");
        if (checkBox.checked == true) {
            setSkeletonSuges(true);
        } else {
            correctRef.current.getContext("2d").clearRect(0, 0, W, H);
            setSkeletonSuges(false);
        }
    };

    useEffect(() => {
        if (skeletonWatch == true) {
            try {
                drawSkeleton(
                    posesJson.keypoints,
                    0.75,
                    canvasRef.current.getContext("2d"),
                    W,
                    H
                );
            } catch (error) {
                void 0;
            }
        }
        if (skeletonSuges == true) {
            drawSkeleton(
                correctPosesJson.keypoints,
                1.25,
                correctRef.current.getContext("2d"),
                W,
                H,
                "orange"
            );
        }
    });

    /*const [detalles, setDetalles] = useState(false);

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

{detalles ? Coordinates(correctPosesJson) : ""}
*/
    return (
        <Container fluid>
            <Row>
                <Col md={3}>
                    <div className="pretty_container_left">
                        <h4>Opciones</h4>
                        <div className="custom-control custom-checkbox">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                id="cuadradoCheck"
                                defaultChecked={true}
                                onClick={(e) => {
                                    setShowCuadrado(!showCuadrado);
                                }}
                            />
                            <label
                                className="custom-control-label"
                                for="cuadradoCheck"
                            >
                                Enmarcar pose
                            </label>
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
                                defaultChecked={true}
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

                        <Button
                            variant="outline-light"
                            href="/posture-analyzer"
                            className="pog"
                        >
                            Cambiar instrumento
                        </Button>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="pretty_container_center">
                        <div className="pose img-overlay-wrap">
                            <PoseNet
                                height={H}
                                width={W}
                                frameRate={30}
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
                            {showCuadrado ? (
                                <svg width={W} height={H}>
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
                                        stroke={Evaluation(errorJson, theta)}
                                        stroke-width={5}
                                    />
                                </svg>
                            ) : (
                                <svg></svg>
                            )}

                            <canvas ref={canvasRef} width={W} height={H} />
                            <canvas ref={correctRef} width={W} height={H} />
                        </div>
                        <h1>{EvalHead(errorJson, theta)}</h1>
                        <p>{EvalMsg(errorJson, theta)}</p>
                    </div>
                </Col>
                <Col md={3}>
                    {instrumento.instrumento == "VIOLIN" ? (
                        <div className="pretty_container_left">
                            <h4>Tips para Violin</h4>
                            <ul>
                                <li>Relaja tus hombros y mantenlos derechos</li>
                                <li>
                                    Sostiene el violin de tal manera que este
                                    paralelo al suelo
                                </li>
                                <li>
                                    No sostengas el mango del violin con la
                                    palma de tu mano. Usa la base de tu pulgar.
                                </li>
                                <li>
                                    El arco debe ir en perpendicular con el
                                    mastil del Violin para un sonido adecuado
                                </li>
                                <li>Manten tus muñecas relajadas y derechas</li>
                                <li>
                                    Si estas parado balanceate usando ambos pies
                                    en vez de solo tu pierna dominante
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="pretty_container_left">
                            <h4>Tips para Guitarra</h4>
                            <ul>
                                <li>Sientate derecho</li>

                                <li>
                                    Reposa tu pie izquierdo sobre alguna
                                    superficie cercana
                                </li>

                                <li>
                                    Situa la guitarra entre medio de tus piernas
                                </li>
                                <li>
                                    El clavijero deberia estar a la altura de tu
                                    cabeza (aproximadamente)
                                </li>
                                <li>Manten tus muñecas relajadas y derechas</li>
                            </ul>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Posture;
