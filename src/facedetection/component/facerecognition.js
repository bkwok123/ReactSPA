import React from 'react';
import "./facerecognition.css";

const FaceRecognition = ({ imgURL, box}) => {
    console.log("imgURL: ", imgURL);
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id="idInputimage" src={imgURL} alt="Face Detection" width="auto" height="auto"/>
                {/* <div className="bounding-box"></div> */}
                <div className="bounding-box" style={{left: box.leftcol, top: box.toprow, right: box.rightcol, bottom: box.bottomrow}}></div>
                {/* <div className="bounding-box" style={{left: box.leftcol, top: box.toprow, right: 0, bottom: 0}}></div> */}
                {/* <div className="bounding-box" style={{top: 500, right: 0, bottom: 0, left: 333}}></div> */}
            </div>
        </div>
    )
}

export default FaceRecognition;