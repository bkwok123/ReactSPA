import React from 'react';
import "../css/facerecognition.css";

const FaceRecognition = ({ imgURL, imgsize, box}) => {
    
    const displaybox = [];

    console.log("FaceRecognition");

    if(box.length > 0) {
        console.log("FaceRecognition: ", box);
        console.log("imgsize: ", imgsize);

        for (let i=0; i<box.length; i++) {
            displaybox.push(
            <div className="bounding-box-set" key={`bs${i}`}>
                <div className="bounding-box" style={{left: box[i].leftcol, top: box[i].toprow, right: box[i].rightcol, bottom: box[i].bottomrow}}></div>
            </div>);
        }        
    }    

    return (
        <div className="face-recognition-container">        
            <img id="idInputimage" src={imgURL} className="image-view"/>
            <div className="bounding-box-container">
                <div className="bounding-boxes" style={{width: imgsize.width, height: imgsize.height}}>
                    {displaybox}
                </div>    
            </div>
        </div>
    )
}

export default FaceRecognition;