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
            mediaRecorder: null,
            mediaSource: null,
            recordedBlobs: [],
            constraints: {
                            audio: true,
                            video: true
                         },
        };
        this.videoLivRef = React.createRef();
        this.videoRecRef = React.createRef();
    }
    
    // Open video source, traffic must be a secured section
    async openVideoSource (e) {

        const isSecureOrigin = window.location.protocol === 'https:' || window.location.host.includes('localhost');
        if (!isSecureOrigin) {
            alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
                  '\n\nChanging protocol to HTTPS');
        }
        else {
            let stream = null;

            try {
                stream = await navigator.mediaDevices.getUserMedia(this.state.constraints);                             

                // Attach stream from opened video source to DOM object        
                console.log('getUserMedia() got stream: ', stream);
                this.videoLivRef.current.srcObject = stream;
            } 
            catch(error) {
                // Notify user when video source fail to open
                alert('navigator.getUserMedia error: ', error);
            }
        }
    }

    // Stop video source
    stopStreamedVideo(e) {

        if (this.videoLivRef.current.srcObject) {
            const stream = this.videoLivRef.current.srcObject;
            const tracks = stream.getTracks();
                  
            tracks.forEach((track) => {
                track.stop();
            });
          
            this.videoLivRef.current.srcObject = null;
        }
    }

    recordVideo(e) {
        let mediaSource = new MediaSource();
        mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
        this.startRecording();

        this.setState({        
            mediaSource: mediaSource,
        })
    }

    handleSourceOpen(event) {
        console.log('MediaSource opened');
        const sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', sourceBuffer);
    }
          
    // The nested try blocks will be simplified when Chrome 47 moves to Stable
    startRecording() {
                
        let mediaRecorder = null;
        const react_this = this;        
        let options = {mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000};        
        const recordedBlobs = [];   // Start a new stream every time when start is pressed
        // const recordedBlobs = this.state.recordedBlobs.slice();  // Append to the current stream every time when start is pressed
        const stream = this.videoLivRef.current.srcObject;
        try {
        mediaRecorder = new MediaRecorder(stream, options);
        } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', options, e0);
            try {
                options = {mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000};
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e1) {
                console.log('Unable to create MediaRecorder with options Object: ', options, e1);
                try {
                options = 'video/mp4';
                mediaRecorder = new MediaRecorder(stream, options);
                } catch (e2) {
                alert('MediaRecorder is not supported by this browser.');
                console.error('Exception while creating MediaRecorder:', e2);
                return;
                }
            }
        }
        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

        // Attach onstop event function to the mediaRecorder
        mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
        };

        // Attach ondataavailable event function to the mediaRecorder
        mediaRecorder.ondataavailable = (event) => {

            try{                                                       
                if (event.data && event.data.size > 0) {
                    recordedBlobs.push(event.data);
    
                    react_this.setState({        
                        recordedBlobs: recordedBlobs,
                    });
                }
            }    
            catch(error) {
                console.log('Error in handleDataAvailable: ', error);
            }               
        }

        // Collect 10ms of data at a time => ondataavailable event is then called to push the data into buffer
        mediaRecorder.start(10);
        console.log('MediaRecorder started', mediaRecorder);

        this.setState({        
            mediaRecorder: mediaRecorder,
        })        
    }
    
    stopRecording(e) {
        if(this.state.mediaRecorder) {            
            if (this.state.mediaRecorder.state !== "inactive") {
                this.state.mediaRecorder.stop();
                console.log('Recorded Blobs: ', this.state.recordedBlobs);

                // Turn on inline video control bar
                this.videoRecRef.current.controls = true;

                // Turn off "right click menu"
                this.videoRecRef.current.addEventListener('contextmenu', (e) => { 
                    // do something here... 
                    e.preventDefault(); 
                  }, false);                
            }
        }
    }
    
    playVideo(e) {
        const superBuffer = new Blob(this.state.recordedBlobs, {type: 'video/webm'});
        this.videoRecRef.current.src = window.URL.createObjectURL(superBuffer);        
    }
    
    render() {

        return (
            <div className={`VideoApp ${this.context.background}`}>
                <div className={`VideoContent ${this.context.background }`}>                    
                    <video id="live" autoPlay muted playsInline ref={this.videoLivRef} className={this.context.foreground}></video>
                    <video id="recorded" autoPlay loop playsInline ref={this.videoRecRef} className={this.context.foreground}></video>
                </div>
                <div>
                    <button onClick={(e) => this.openVideoSource(e)}>Turn on Device</button>
                    <button onClick={(e) => this.stopStreamedVideo(e)}>Turn off Device</button>
                    <button onClick={(e) => this.recordVideo(e)}>Record</button>
                    <button onClick={(e) => this.stopRecording(e)}>Stop</button>
                    <button onClick={(e) => this.playVideo(e)}>Play</button>
                </div>
            </div>
        );
    } 

}

export default VideoCapture