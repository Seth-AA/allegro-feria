import React from "react";

const defaultcolor = "aqua";
const lineWidth = 2;

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
        return <p>Pose no identificada.</p>;
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
