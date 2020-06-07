import React from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/videocapture.css';

// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Video_player_styling_basics
// https://medium.com/canal-tech/how-video-streaming-works-on-the-web-an-introduction-7919739f7e1
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
            controls:   {
                            sourceON: false,
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

        this.setState({        
            controls:   {
                sourceON: true,
            },
        })        
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

        this.setState({        
            controls:   {
                sourceON: false,
            },
        })        
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
        } 
        catch (e0) {
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
                    alert('MediaRecorder failed to find source in this browser.');
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
            }
        }
    }
    
    streamVideo(e) {
        const superBuffer = new Blob(this.state.recordedBlobs, {type: 'video/webm'});
        const video = this.videoRecRef.current;

        // Check HTML5 compatibility
        const supportsVideo = !!document.createElement('video').canPlayType;
        if (!supportsVideo) {
            // Turn on inline video control bar
            this.videoRecRef.current.controls = true;

            // Turn off "right click menu"
            this.videoRecRef.current.addEventListener('contextmenu', (e) => { 
                // do something here... 
                e.preventDefault(); 
            }, false); 
        }

        video.src = window.URL.createObjectURL(superBuffer);
        video.pause();
        video.currentTime = 0;                
    }

    play(e) {
        const video = this.videoRecRef.current;
        (video.paused || video.ended) ? video.play() : video.pause();
    }

    stop(e) {
        const video = this.videoRecRef.current;
        video.pause();
        video.currentTime = 0;
    }    

    mute(e) {
        const video = this.videoRecRef.current;
        video.muted = !video.muted;
    }

    volinc(e) {        
        const video = this.videoRecRef.current;
        const currentVolume = Math.floor(video.volume * 10) / 10;
        if (currentVolume < 1) video.volume += 0.1;
    }

    voldec(e) {        
        const video = this.videoRecRef.current;
        const currentVolume = Math.floor(video.volume * 10) / 10;
        if (currentVolume > 0) video.volume -= 0.1;
    }

    download() {
        const blob = new Blob(this.state.recordedBlobs, {type: 'video/webm'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }    

    render() {
        const sourceOn = this.state.controls.sourceON;
        const sourceOnText = sourceOn ? "Turn off Device" : "Turn on Device";

        return (
            <div className={`VideoApp ${this.context.background}`}>
                <div className={`VideoBox ${this.context.background }`}>                    
                    <video id="live" autoPlay muted playsInline ref={this.videoLivRef} className={this.context.foreground}></video>
                    <div className="VideoControls">
                        <button onClick={(e) => sourceOn ? this.stopStreamedVideo(e) : this.openVideoSource(e)} className={this.context.btnFG}>{sourceOnText}</button>
                        <button onClick={(e) => this.recordVideo(e)} className={this.context.btnFG}>Record</button>
                        <button onClick={(e) => this.stopRecording(e)} className={this.context.btnFG}>Stop</button>
                        <button onClick={(e) => this.streamVideo(e)} className={this.context.btnFG}>Stream</button>
                    </div>                                        
                </div>

                <div className={`VideoBox ${this.context.background }`}>                 
                    <video id="recorded" autoPlay loop playsInline ref={this.videoRecRef} className={this.context.foreground}></video>
                    <div className="VideoControls">
                        <button onClick={(e) => this.play(e)} className={this.context.btnFG}>Play</button>
                        <button onClick={(e) => this.stop(e)} className={this.context.btnFG}>Stop</button>
                        <button onClick={(e) => this.mute(e)} className={this.context.btnFG}>Mute</button>
                        <button onClick={(e) => this.volinc(e)} className={this.context.btnFG}>+</button>
                        <button onClick={(e) => this.voldec(e)} className={this.context.btnFG}>-</button>
                        <button onClick={(e) => this.download(e)} className={this.context.btnFG}>Download</button>                    
                    </div>                    
                </div>
            </div>
        );
    } 

}

export default VideoCapture