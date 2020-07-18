import React, { useState, useMemo } from "react";
import PoseNet from "react-posenet";
import "./Posture.css";

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

function edgePoint(posesJson, axis, type) {
  try {
    if (axis == "x") {
      if (type == "max") {
        return Math.max
          .apply(
            Math,
            posesJson.keypoints.map((posesParts, index) => {
              return posesParts.position.x;
            })
          )
          .toFixed(0);
      } else {
        return Math.min
          .apply(
            Math,
            posesJson.keypoints.map((posesParts, index) => {
              return posesParts.position.x;
            })
          )
          .toFixed(0);
      }
    } else {
      if (type == "max") {
        return Math.max
          .apply(
            Math,
            posesJson.keypoints.map((posesParts, index) => {
              return posesParts.position.y;
            })
          )
          .toFixed(0);
      } else {
        return Math.min
          .apply(
            Math,
            posesJson.keypoints.map((posesParts, index) => {
              return posesParts.position.y;
            })
          )
          .toFixed(0);
      }
    }
  } catch (error) {
    return 0;
  }
}
function Coordinates(posesJson) {
  try {
    return posesJson.keypoints.map((posesParts, index) => {
      return (
        <h4>
          {posesParts.part}: x: {posesParts.position.x.toFixed(0)}, y:{" "}
          {posesParts.position.y.toFixed(0)}
        </h4>
      );
    });
  } catch (error) {
    return <h3>Pose no identificada</h3>;
  }
}

function Posture() {
  const [posesJson, setPosesJson] = useState({
    score: 0,
    keypoints: [{ position: { x: 0, y: 0 }, part: "null", score: 0 }],
  });

  const example = useMemo(() => {
    const image = new Image();
    image.crossOrigin = "";
    image.src = require("./assets/images/example.jpg");
    return image;
  }, []);

  return (
    <div>
      <div class="img-overlay-wrap">
        <PoseNet
          input={example}
          height={example.height}
          width={example.width}
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
            } catch (error) {
              setPosesJson({ score: 0, keypoints: [] });
            }
          }}
        />
        <svg height={example.height} width={example.width}>
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
      </div>
      {Coordinates(posesJson)}
    </div>
  );
}

export default Posture;
