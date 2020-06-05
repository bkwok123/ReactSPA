import React from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/videocapture.css';

// https://simpl.info/mediarecorder/
// https://stackoverflow.com/questions/48603402/how-to-set-srcobject-on-audio-element-with-react
// https://reactjs.org/docs/refs-and-the-dom.html
class VideoCapture extends React.Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.state = {
            mediaRecorder: "",
            constraints: {
                            audio: true,
                            video: true
                         },
        };
        this.videoRef = React.createRef();
    }
    
    async openVideoSource () {

        const isSecureOrigin = window.location.protocol === 'https:' || window.location.host.includes('localhost');
        if (!isSecureOrigin) {
            alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
                  '\n\nChanging protocol to HTTPS');
        }
        else {
            let stream = null;

            try {
                stream = await navigator.mediaDevices.getUserMedia(this.state.constraints);             
                this.successCallback(stream);
            } 
            catch(error) {
                this.errorCallback(error)
            }
        }
    }

    successCallback(stream) {
        console.log('getUserMedia() got stream: ', stream);        
        this.videoRef.current.srcObject = stream;
    }
    
    errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    stopStreamedVideo(e) {

        if (this.videoRef.current.srcObject) {
            const stream = this.videoRef.current.srcObject;
            const tracks = stream.getTracks();
                  
            tracks.forEach((track) => {
                track.stop();
                });
          
            this.videoRef.current.srcObject = null;
        }
    }

    render() {

        return (
            <div className={`VideoApp ${this.context.background}`}>
                <div className={`VideoContent ${this.context.background }`}>                    
                    <video id="live" autoPlay muted playsInline ref={this.videoRef} className={this.context.foreground}></video>
                    <video id="recorded" autoPlay loop playsInline className={this.context.foreground}></video>
                </div>
                <div>
                    <button onClick={(e) => this.openVideoSource(e)}>Turn on Device</button>
                    <button onClick={(e) => this.stopStreamedVideo(e)}>Turn off Device</button>
                </div>
            </div>
        );
    } 

}

export default VideoCapture