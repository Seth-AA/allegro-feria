import React, { useState, useRef, useEffect } from "react";
import PoseNet from "react-posenet";
import "./Posture.css";
import {
    edgePoint,
    Coordinates,
    drawSkeleton,
    Evaluation,
    correctPos,
} from "./Posture_utils.js";

import { Container, Row, Col } from "react-bootstrap";

function correctPoints(posesJson) {
    const points = posesJson.keypoints;
    var correctPoints = {
        score: posesJson.score,
        keypoints: [],
    };
    points.forEach((element, index) => {
        if (element.part == "leftWrist") {
            const point1 = posesJson.keypoints.filter((part) => {
                return part.part == "rightWrist";
            });
            correctPoints.keypoints.push(
                correctPos(point1[0], element, 310, 190, 202, 242)
            );
        } else if (element.part == "leftElbow") {
            const point1 = posesJson.keypoints.filter((part) => {
                return part.part == "rightElbow";
            });
            correctPoints.keypoints.push(
                correctPos(point1[0], element, 276, 236, 144, 217)
            );
        } else if (element.part == "leftKnee") {
            const point1 = posesJson.keypoints.filter((part) => {
                return part.part == "rightKnee";
            });
            correctPoints.keypoints.push(
                correctPos(point1[0], element, 354, 362, 79, 514)
            );
        } else if (element.part == "leftAnkle") {
            const point1 = posesJson.keypoints.filter((part) => {
                return part.part == "rightAnkle";
            });
            correctPoints.keypoints.push(
                correctPos(point1[0], element, 323, 574, 168, 655)
            );
        } else {
            correctPoints.keypoints.push(element);
        }
    });

    return correctPoints;
}

function Posture() {
    const H = 525;
    const W = 700;

    const [posesJson, setPosesJson] = useState({ score: 0, keypoints: [] });

    const [correctPosesJson, setCorrectPosesJson] = useState({
        score: 0,
        keypoints: [],
    });

    const [skeletonWatch, setSkeletonWatch] = useState(false);
    const [skeletonSuges, setSkeletonSuges] = useState(false);

    const [detalles, setDetalles] = useState(false);

    const canvasRef = useRef(null);
    const correctRef = useRef(1);

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
                    0.5,
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
                0.5,
                correctRef.current.getContext("2d"),
                W,
                H,
                "orange"
            );
        }
    });

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
                    </div>
                </Col>
                <Col md={6}>
                    <div className="pretty_container_center img-overlay-wrap pose">
                        <PoseNet
                            height={H}
                            width={W}
                            frameRate={15}
                            inferenceConfig={{
                                decodingMethod: "single-person",
                                architecture: "MobileNetV1",
                                outputStride: 16,
                                multiplier: 0.5,
                                quantBytes: 1,
                            }}
                            onEstimate={(poses) => {
                                try {
                                    setPosesJson(poses[0]);
                                    setCorrectPosesJson(
                                        correctPoints(poses[0])
                                    );
                                } catch (error) {
                                    setPosesJson({ score: 0, keypoints: [] });
                                    setCorrectPosesJson({
                                        score: 0,
                                        keypoints: [],
                                    });
                                }
                            }}
                        />
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
                                stroke={Evaluation(posesJson, correctPosesJson)}
                                stroke-width={5}
                            />
                        </svg>
                        <canvas ref={canvasRef} width={W} height={H} />
                        <canvas ref={correctRef} width={W} height={H} />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="pretty_container_right">
                        {" "}
                        {detalles ? Coordinates(posesJson) : ""}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Posture;
