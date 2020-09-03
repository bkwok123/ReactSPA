import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/facedetectioncontrol.css';

class FaceDetectionControl extends Component {

    static contextType = ThemeContext;

    // https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
    dropHandler(e) {
        console.log('File(s) dropped');
        
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();
        
        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                // Accept dropped items as files only
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();                    
                    const parent = this.props.parent;
                    parent.handleFile(parent, file)
                }
            }
        }
    }

    dragOverHandler(e) {      
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();
    }

    render() {              

        const parent = this.props.parent;

        return (              
            <div className={`FaceDetectionControl ${this.context.foreground}`}>
                <h1 className={`${this.context.btnFG}`}>Upload a local file: </h1>

                <div id="idDropZone" className={`${this.context.border}`} onDrop={(e)=>this.dropHandler(e)} onDragOver={(e)=>this.dragOverHandler(e)}>
                    <p>Drag a file to this Drop Zone</p>
                </div>                

                <label className={`${this.context.btnFG} inputborder`}>                        
                    <input id="idImgFileSelector" type="file" accept=".jpg, .jpeg, .png" onChange={() => parent.onChangeUpload(parent)}></input>
                    Browse Local Image
                </label>
                
                <p className={`${this.context.btnFG}`}>OR</p>
                <h1 className={`${this.context.btnFG}`}>Enter an external link on web:</h1>

                <input id="idInputImgLink" type="text" onChange={() => parent.onChangeImgURL()} className={`${this.context.btnFG}`} placeholder="Paste URL"></input>
            </div>            
        );
    }
}

export default FaceDetectionControl