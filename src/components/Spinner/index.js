import React from 'react';
import "./loading.css"

const Spinner = ({fixed, height, parentHeight, heightCustom, center, style, type = "grid"}) => {
  return (
    <div className={`d-flex w-100 ${parentHeight ?? "h-100"} text-center ${fixed ? "position-absolute" : ""}`} style={style}>
      <div
        className={`${height ? "h-100" : heightCustom ?? "vh-100"} w-100 ${center ? "d-flex align-items-center justify-content-center" : "d-flex-center"}`}>
        {
          type === "roller"
            ? <div className="lds-roller">
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
            </div>
            : <div className="lds-grid">
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
              <div/>
            </div>
        }
      
      </div>
    </div>
  );
};

export default Spinner;
