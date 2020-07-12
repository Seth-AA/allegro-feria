import React, { Component } from "react";
import PoseNet from "react-posenet";

class Posture extends Component {
  render() {
    return (
      <div>
        <PoseNet
          width={200}
          height={200}
          frameRate={30}
          inferenceConfig={{
            decodingMethod: "single-person",
            architecture: "MobileNetV1",
          }}
        />
      </div>
    );
  }
}

export default Posture;
