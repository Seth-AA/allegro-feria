import React, { useState, useRef, useEffect } from "react";
import PoseNet from "react-posenet";
import "./Posture.css";
import { edgePoint, Coordinates, drawSkeleton } from "./Posture_utils.js";

function Evaluation(posesJson) {
    var resultRight;
    var resultLeft;
    var leftWrist;
    var rightWrist;

    try {
        const Points = posesJson.keypoints.filter((part) => {
            return part.part == "leftWrist" || part.part == "rightWrist";
        });
        leftWrist = Points[0].position;
        rightWrist = Points[1].position;
    } catch (error) {
        return "black";
    }

    if (
        Math.abs(
            parseInt(rightWrist.y, 10) -
                ((159 - 90) / (144 - 309)) *
                    (parseInt(rightWrist.x, 10) - 309) -
                90
        ) < 50
    ) {
        resultRight = "yellow";
    } else {
        resultRight = "red";
    }
    if (
        Math.abs(
            parseInt(leftWrist.y, 10) -
                ((159 - 90) / (144 - 309)) * (parseInt(leftWrist.x, 10) - 309) -
                90
        ) < 50
    ) {
        resultLeft = "yellow";
    } else {
        resultLeft = "red";
    }

    if (resultLeft == "yellow" || resultRight == "yellow") {
        if (resultLeft == resultRight) {
            return "green";
        }
        return "yellow";
    }
    return "red";
}

function correctPos(point, x1, y1, x2, y2) {
    var m1 = (y2 - y1) / (x2 - x1);
    var n1 = y1 - m1 * x1;

    var m2 = -1 / m1;
    var n2;

    var x;
    var y;

    n2 = parseInt(point.position.y, 10) - m2 * parseInt(point.position.x, 10);

    x = Math.min((n1 - n2) / (m2 - m1), 399);
    y = Math.min((m2 * (n1 - n2)) / (m2 - m1) + n2, 299);

    const correctPoint = {
        position: { x, y },
        part: point.part,
        score: point.score,
    };

    return correctPoint;
}

function correctPoints(posesJson) {
    const points = posesJson.keypoints;
    var correctPoints = {
        score: posesJson.score,
        keypoints: [],
    };

    points.forEach((element, index) => {
        if (element.part == "rightWrist") {
            correctPoints.keypoints.push(
                correctPos(element, 309, 90, 144, 159)
            );
        } else if (element.part == "leftWrist") {
            correctPoints.keypoints.push(
                correctPos(element, 309, 90, 144, 159)
            );
        } else if (element.part == "leftElbow") {
            correctPoints.keypoints.push(
                correctPos(element, 282, 164, 68, 165)
            );
        } else if (element.part == "rightElbow") {
            correctPoints.keypoints.push(
                correctPos(element, 282, 164, 68, 165)
            );
        } else if (element.part == "leftKnee") {
            correctPoints.keypoints.push(
                correctPos(element, 266, 186, 242, 230)
            );
        } else if (element.part == "leftAnkle") {
            correctPoints.keypoints.push(
                correctPos(element, 266, 186, 242, 230)
            );
        } else if (element.part == "rightKnee") {
            correctPoints.keypoints.push(
                correctPos(element, 60, 257, 126, 262)
            );
        } else if (element.part == "rightAnkle") {
            correctPoints.keypoints.push(
                correctPos(element, 60, 257, 126, 262)
            );
        } else {
            correctPoints.keypoints.push(element);
        }
    });

    return correctPoints;
}
function Posture() {
    const [posesJson, setPosesJson] = useState({ score: 0, keypoints: [] });

    const [correctPosesJson, setCorrectPosesJson] = useState({
        score: 0,
        keypoints: [],
    });

    const [skeletonWatch, setSkeletonWatch] = useState(false);

    const canvasRef = useRef(null);
    const correctRef = useRef(1);

    const handleSkeleton = (width, height) => {
        var checkBox = document.getElementById("skeletonCheck");
        if (checkBox.checked == true) {
            setSkeletonWatch(true);
        } else {
            canvasRef.current.getContext("2d").clearRect(0, 0, 400, 300);
            correctRef.current.getContext("2d").clearRect(0, 0, 400, 300);
            setSkeletonWatch(false);
        }
    };

    useEffect(() => {
        if (skeletonWatch == true) {
            try {
                drawSkeleton(
                    posesJson.keypoints,
                    0.5,
                    canvasRef.current.getContext("2d"),
                    400,
                    300
                );
                drawSkeleton(
                    correctPosesJson.keypoints,
                    0.5,
                    correctRef.current.getContext("2d"),
                    400,
                    300,
                    "orange"
                );
            } catch (error) {
                void 0;
            }
        }
    });

    return (
        <div>
            <div class="img-overlay-wrap">
                <PoseNet
                    height={300}
                    width={400}
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
                            setCorrectPosesJson(correctPoints(poses[0]));
                        } catch (error) {
                            setPosesJson({ score: 0, keypoints: [] });
                            setCorrectPosesJson({ score: 0, keypoints: [] });
                        }
                    }}
                />
                <svg height={400} width={300}>
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
                        stroke={Evaluation(posesJson)}
                        stroke-width={5}
                    />
                </svg>
                <canvas ref={canvasRef} width={400} height={300} />
                <canvas ref={correctRef} width={400} height={300} />
            </div>

            <div className="pretty_container options">
                <h4>Opciones</h4>
                <div className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        id="skeletonCheck"
                        onClick={(e) => {
                            handleSkeleton(400, 300);
                        }}
                    />
                    <label className="custom-control-label" for="skeletonCheck">
                        Mostrar esqueleto
                    </label>
                </div>
                <h4>Partes identificadas:</h4>
                {Coordinates(posesJson)}
            </div>
        </div>
    );
}

export default Posture;
