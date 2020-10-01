import React from "react";

const defaultcolor = "aqua";
const lineWidth = 4;

const connectedPartNames = [
    ["leftHip", "leftShoulder"],
    ["leftElbow", "leftShoulder"],
    ["leftElbow", "leftWrist"],
    ["leftHip", "leftKnee"],
    ["leftKnee", "leftAnkle"],
    ["rightHip", "rightShoulder"],
    ["rightElbow", "rightShoulder"],
    ["rightElbow", "rightWrist"],
    ["rightHip", "rightKnee"],
    ["rightKnee", "rightAnkle"],
    ["leftShoulder", "rightShoulder"],
    ["leftHip", "rightHip"],
];

function getAdjacentKeyPoints(keypoints, minConfidence) {
    var groups = [];

    connectedPartNames.forEach((pair) => {
        const part1 = keypoints.filter((part) => {
            return part.part == pair[0];
        });
        const part2 = keypoints.filter((part) => {
            return part.part == pair[1];
        });
        if (
            Object.keys(part1).length !== 0 &&
            Object.keys(part2).length !== 0
        ) {
            groups.push([part1, part2]);
        }
    });

    return groups;
}

export function edgePoint(posesJson, axis, type) {
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

export function Coordinates(posesJson) {
    try {
        return posesJson.keypoints.map((posesParts, index) => {
            return (
                <p>
                    {posesParts.part}: x: {posesParts.position.x.toFixed(0)}, y:{" "}
                    {posesParts.position.y.toFixed(0)}
                </p>
            );
        });
    } catch (error) {
        return <p>{JSON.stringify(posesJson)}</p>;
    }
}

export function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(
    keypoints,
    minConfidence,
    ctx,
    width,
    height,
    color = defaultcolor
) {
    ctx.clearRect(0, 0, width, height);

    const ads = getAdjacentKeyPoints(keypoints, minConfidence);
    ads.forEach((pair) => {
        drawSegment(
            [pair[0][0].position.y, pair[0][0].position.x],
            [pair[1][0].position.y, pair[1][0].position.x],
            color,
            ctx
        );
    });
}

export function distance(x1, y1, x2, y2) {
    return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
}

export function Error(posesJson, correctPosesJson) {
    var errorJson = { error: 0, keypoints: [] };
    try {
        var err;
        posesJson.keypoints.forEach((part, index) => {
            err = distance(
                part.position.x,
                part.position.y,
                correctPosesJson.keypoints[index].position.x,
                correctPosesJson.keypoints[index].position.y
            );
            errorJson.error = errorJson.error + err;
            errorJson.keypoints.push({ part: part.part, error: err });
        });

        return errorJson;
    } catch (error) {
        errorJson.error = -1;
        return errorJson;
    }
}

export function Evaluation(errorJson, theta = 0) {
    try {
        if (errorJson.error == -1) {
            return "black";
        }

        var errorEval = "black";
        var no_yel_flag = true;
        var no_red_flag = true;
        var lw = false;
        var rw = false;
        var le = false;
        var re = false;
        var error;
        errorJson.keypoints.forEach((part, index) => {
            error = part.error;
            if (part.part == "leftWrist") {
                lw = true;
            }
            if (part.part == "rightWrist") {
                rw = true;
            }
            if (part.part == "leftElbow") {
                le = true;
            }
            if (part.part == "rightElbow") {
                re = true;
            }
            if (error > 80 + theta) {
                errorEval = "red";
                no_red_flag = false;
            }
            if (error > 40 + theta && no_red_flag) {
                errorEval = "yellow";
                no_yel_flag = false;
            }
            if (error < 40 + theta && no_red_flag && no_yel_flag) {
                errorEval = "green";
            }
        });
        if (lw && rw && le && re) {
            return errorEval;
        } else return "black";
    } catch (error) {
        return "black";
    }
}

export function EvalHead(errorJson) {
    try {
        if (errorJson.error == -1) {
            return "Identificando pose...";
        }
        var errorEval = "Identificando pose...";
        var no_yel_flag = true;
        var no_red_flag = true;
        var lw = false;
        var rw = false;
        var le = false;
        var re = false;
        var error;
        errorJson.keypoints.forEach((part, index) => {
            error = part.error;
            if (part.part == "leftWrist") {
                lw = true;
            }
            if (part.part == "rightWrist") {
                rw = true;
            }
            if (part.part == "leftElbow") {
                le = true;
            }
            if (part.part == "rightElbow") {
                re = true;
            }
            if (error > 80) {
                errorEval = "Postura inadecuada";
                no_red_flag = false;
            }
            if (error > 40 && no_red_flag) {
                errorEval = "Postura mejorable";
                no_yel_flag = false;
            }
            if (error < 40 && no_red_flag && no_yel_flag) {
                errorEval = "¡Buena Postura!";
            }
        });
        if (lw && rw && le && re) {
            return errorEval;
        } else return "Identificando pose...";
    } catch (error) {
        return "Identificando pose...";
    }
}

function traducir(part) {
    var dict = new Map();
    dict.set("nose", "nariz");
    dict.set("leftEye", "ojo izquierdo");
    dict.set("rightEye", "ojo derecho");
    dict.set("leftEar", "oreja izquierda");
    dict.set("rightEar", "oreja derecha");
    dict.set("leftHip", "cadera izquierda");
    dict.set("rightHip", "cadera derecha");

    dict.set("leftShoulder", "hombro izquierdo");
    dict.set("rightShoulder", "hombro derecho");
    dict.set("leftElbow", "codo izquierdo");
    dict.set("rightElbow", "codo derecho");
    dict.set("leftWrist", "muñeca izquierda");
    dict.set("rightWrist", "muñeca derecha");
    dict.set("leftKnee", "rodilla izquierda");
    dict.set("rightKnee", "rodilla derecha");
    dict.set("leftAnkle", "tobillo izquierdo");
    dict.set("rightAnkle", "tobillo derecho");
    return dict.get(part);
}

export function EvalMsg(errorJson) {
    try {
        if (errorJson.error == -1) {
            return "";
        }
        var worstPart = "";
        var worstError = -1;
        var error;
        var no_yel_flag = true;
        var no_red_flag = true;
        var lw = false;
        var rw = false;
        var le = false;
        var re = false;
        var errorEval = "";
        errorJson.keypoints.forEach((part, index) => {
            error = part.error;
            if (error > worstError) {
                worstPart = part.part;
                worstError = error;
            }
            if (part.part == "leftWrist") {
                lw = true;
            }
            if (part.part == "rightWrist") {
                rw = true;
            }
            if (part.part == "leftElbow") {
                le = true;
            }
            if (part.part == "rightElbow") {
                re = true;
            }
            if (error > 80) {
                errorEval = "Postura inadecuada";
                no_red_flag = false;
            }
            if (error > 40 && no_red_flag) {
                errorEval = "Postura mejorable";
                no_yel_flag = false;
            }
            if (error < 40 && no_red_flag && no_yel_flag) {
                errorEval = "¡Buena Postura!";
            }
        });
        if (lw && rw && le && re) {
            if (errorEval == "¡Buena Postura!") {
                return "";
            } else return "Acomoda mejor tu " + traducir(worstPart);
        } else return "";
    } catch (error) {
        return "";
    }
}

export function correctPos(partLeft, partRight, x1, y1, x2, y2, lefty) {
    if (lefty) {
        x1 = -x1 + 340;
        x2 = -x2 + 340;
    }
    const m1 = (y2 - y1) / (x2 - x1);

    const R = distance(
        partLeft.position.x,
        partLeft.position.y,
        partRight.position.x,
        partRight.position.y
    );

    let x;
    let y;

    if (!lefty) {
        x = partLeft.position.x + R * Math.cos(Math.atan(m1));
        y = partLeft.position.y + R * Math.sin(Math.atan(m1));
    } else {
        x = partLeft.position.x - R * Math.cos(Math.atan(m1));
        y = partLeft.position.y - R * Math.sin(Math.atan(m1));
    }
    const correctPoint2 = {
        position: { x, y },
        part: partRight.part,
        score: 1,
    };

    return correctPoint2;
}
