import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/facedetectioncontrol.css';

class FaceDetectionControl extends Component {

    static contextType = ThemeContext;

    render() {              

        const parent = this.props.parent;

        return (  
            <div className={`FaceDetectionControl ${this.context.foreground}`}>
                <button onClick={() => parent.onChangeUpload(parent)} className={`${this.context.btnFG} fdControlB1`}>Refresh Local</button>
                <label className={`${this.context.btnFG} fdControlB2 inputborder`}>
                    <input id="idImgFileSelector" type="file" accept=".jpg, .jpeg, .png" onChange={() => parent.onChangeUpload(parent)}></input>
                    Upload Local Image
                </label>
                
                <button onClick={() => parent.onChangeImg()} className={`${this.context.btnFG} fdControlB3`}>Refresh Web Link</button>
                <label className={`${this.context.btnFG} fdControlL1`}>Enter an external link on web: </label>
                <input id="idInputImgLink" type="text" onChange={() => parent.onChangeImg()} className={`${this.context.btnFG} fdControlI1`}></input>

                <button onClick={() => parent.onClickDetect(parent)} className={`${this.context.btnFG} fdControlB4`}>Detect</button>
            </div>            
        );
    }
}

export default FaceDetectionControl