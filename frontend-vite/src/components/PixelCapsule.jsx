import React from "react";
import capsule from "/src/assets/capsule.png";

const PixelCapsule = ({ size = 180 }) => {
  return (
    <div
      style={{
        width: size,
        height: "auto",
        marginTop: "15px",
        imageRendering: "pixelated", 
      }}
    >
      <img
        src={capsule}
        alt="Time Capsule"
        style={{
          width: "100%",
          height: "auto",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

export default PixelCapsule;
