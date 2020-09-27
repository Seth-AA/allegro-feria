import React, { useState, useMemo, useRef } from "react";
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
import "./Posture.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
                correctPos(point1[0], element, 398, 232, 185, 356)
            );
        } else if (element.part == "leftElbow") {
            const point1 = posesJson.keypoints.filter((part) => {
                return part.part == "rightElbow";
            });
            correctPoints.keypoints.push(
                correctPos(point1[0], element, 376, 329, 90, 330)
            );
        } else if (element.part == "leftKnee") {
            const point1 = posesJson.keypoints.filter((part) => {
                return part.part == "rightKnee";
            });
            correctPoints.keypoints.push(
                correctPos(point1[0], element, 354, 402, 79, 514)
            );
        } else if (element.part == "leftAnkle") {
            const point1 = posesJson.keypoints.filter((part) => {
                return part.part == "rightAnkle";
            });
            correctPoints.keypoints.push(
                correctPos(point1[0], element, 333, 584, 168, 655)
            );
        } else {
            correctPoints.keypoints.push(element);
        }
    });

    return correctPoints;
}

function Posture() {
    const H = 600;
    const W = 450;
    const [posesJson, setPosesJson] = useState({
        score: 0,
        keypoints: [{ position: { x: 0, y: 0 }, part: "null", score: 0 }],
    });
    const [correctPosesJson, setCorrectPosesJson] = useState({
        score: 0,
        keypoints: [{ position: { x: 0, y: 0 }, part: "correct", score: 0 }],
    });

    const [detalles, setDetalles] = useState(false);

    const example = useMemo(() => {
        const image = new Image();
        image.crossOrigin = "";
        image.src = require("./assets/images/example.jpg");
        return image;
    }, []);

    const [posesImage, setPosesImage] = useState(example);
    const [selectedImage, setSelectedImage] = useState("Seleccione una imagen");

    const handleChange = (e) => {
        if (e.target.files.length) {
            canvasRef.current.getContext("2d").clearRect(0, 0, W, H);
            correctRef.current.getContext("2d").clearRect(0, 0, W, H);
            const image = new Image();
            image.crossOrigin = "";
            image.src = URL.createObjectURL(e.target.files[0]);
            setSelectedImage(e.target.files[0].name);
            setPosesImage(image);
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
                        {detalles ? Coordinates(posesJson) : ""}
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
                                stroke={Evaluation(posesJson, correctPosesJson)}
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
