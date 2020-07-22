import React, { useState, useMemo, useRef } from "react";
import PoseNet from "react-posenet";
import "./Posture.css";
import { edgePoint, Coordinates, drawSkeleton } from "./Posture_utils.js";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";

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
        ((356 - 185) / (185 - 407)) * (parseInt(rightWrist.x, 10) - 407) -
        185
    ) < 50
  ) {
    resultRight = "yellow";
  } else {
    resultRight = "red";
  }
  if (
    Math.abs(
      parseInt(leftWrist.y, 10) -
        ((356 - 185) / (185 - 407)) * (parseInt(leftWrist.x, 10) - 407) -
        185
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

    x = (n1 - n2) / (m2 - m1);
    y = (m2 * (n1 - n2)) / (m2 - m1) + n2;

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
                correctPos(element, 407, 185, 185, 356)
            );
        } else if (element.part == "leftWrist") {
            correctPoints.keypoints.push(
                correctPos(element, 407, 185, 185, 356)
            );
        } else if (element.part == "leftElbow") {
            correctPoints.keypoints.push(
                correctPos(element, 376, 329, 90, 330)
            );
        } else if (element.part == "rightElbow") {
            correctPoints.keypoints.push(
                correctPos(element, 376, 329, 90, 330)
            );
        } else if (element.part == "leftKnee") {
            correctPoints.keypoints.push(
                correctPos(element, 354, 372, 323, 574)
            );
        } else if (element.part == "leftAnkle") {
            correctPoints.keypoints.push(
                correctPos(element, 354, 372, 323, 574)
            );
        } else if (element.part == "rightKnee") {
            correctPoints.keypoints.push(
                correctPos(element, 79, 514, 168, 655)
            );
        } else if (element.part == "rightAnkle") {
            correctPoints.keypoints.push(
                correctPos(element, 79, 514, 168, 655)
            );
        } else {
            correctPoints.keypoints.push(element);
        }
    });

    return correctPoints;
}

function Posture() {
    const [posesJson, setPosesJson] = useState({
        score: 0,
        keypoints: [{ position: { x: 0, y: 0 }, part: "null", score: 0 }],
    });
    const [correctPosesJson, setCorrectPosesJson] = useState({
        score: 0,
        keypoints: [{ position: { x: 0, y: 0 }, part: "correct", score: 0 }],
    });

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
            canvasRef.current.getContext("2d").clearRect(0, 0, 500, 750);
            correctRef.current.getContext("2d").clearRect(0, 0, 500, 750);
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
            drawSkeleton(
                correctPosesJson.keypoints,
                0.5,
                correctRef.current.getContext("2d"),
                witdh,
                height,
                "orange"
            );
        } else {
            canvasRef.current.getContext("2d").clearRect(0, 0, 500, 750);
            correctRef.current.getContext("2d").clearRect(0, 0, 500, 750);
        }
    };

    const canvasRef = useRef(null);
    const correctRef = useRef(1);

    return (
        <div>
            <div class="img-overlay-wrap">
                <PoseNet
                    input={posesImage}
                    height={750}
                    width={500}
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
                <svg height={750} width={500}>
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
                <canvas ref={canvasRef} width={500} height={750} />
                <canvas ref={correctRef} width={500} height={750} />
            </div>

            <div className="pretty_container options">
                <h4>Opciones</h4>
                <div className="custom-file">
                    <input
                        className="custom-file-input"
                        type="file"
                        id="upload-button"
                        onChange={handleChange}
                    />
                    <label className="custom-file-label" for="upload-button">
                        {selectedImage}
                    </label>
                </div>
                <div className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        id="skeletonCheck"
                        onClick={(e) => {
                            handleSkeleton(500, 750);
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
