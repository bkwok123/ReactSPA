import React from 'react';
import "./facerecognition.css";

const FaceRecognition = ({ imgURL, box}) => {
    
    const displaybox = [];

    if(box.length > 0) {
        for (let i=0; i<box.length; i++) {
            displaybox.push(<div className="bounding-box" style={{left: box[i].leftcol, top: box[i].toprow, right: box[i].rightcol, bottom: box[i].bottomrow}}></div>)
        }        
    }    

    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id="idInputimage" src={imgURL} alt="Face Detection" width="auto" height="auto"/>
                {displaybox}
            </div>
        </div>
    )
}

export default FaceRecognition;