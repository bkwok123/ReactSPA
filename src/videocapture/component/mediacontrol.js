import React from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/videocapture.css';

class OpenDeviceControl extends React.Component {

    static contextType = ThemeContext;

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
                stream = await navigator.mediaDevices.getUserMedia(this.props.constraints);                             

                // Attach stream from opened video source to DOM object        
                console.log('getUserMedia() got stream: ', stream);
                this.props.setLiveVideo(stream, true);
            } 
            catch(error) {
                // Notify user when video source fail to open
                console.log('getUserMedia() got stream: ', error);
                alert('navigator.getUserMedia error: ', error);
            }
        }        
    }

    // Stop video source
    stopStreamedVideo(e) {

        if (this.props.videoLiv.srcObject) {
            const stream = this.props.videoLiv.srcObject;
            const tracks = stream.getTracks();
                  
            tracks.forEach((track) => {
                track.stop();
            });
          
            this.props.setLiveVideo(null, false);
        }
    }    

    render() {
        const sourceOn = this.props.controls.sourceON;
        const sourceOnText = sourceOn ? "Turn off Device" : "Turn on Device";        

        return (
            <button onClick={(e) => sourceOn ? this.stopStreamedVideo(e) : this.openVideoSource(e)} className={this.context.btnFG}>{sourceOnText}</button>
        );
    }       
}

class RecordControl extends React.Component {

    static contextType = ThemeContext;

    recordVideo(e) {
        const mediaSource = new MediaSource();
        mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
        this.startRecording();

        this.props.setMediaSource(mediaSource);
    }

    handleSourceOpen(event) {
        console.log('MediaSource opened');
        const sourceBuffer = this.props.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', sourceBuffer);
    }
          
    // The nested try blocks will be simplified when Chrome 47 moves to Stable
    startRecording() {
        
        if(this.props.videoLiv){
            let mediaRecorder = null;
            const react_props = this.props;        
            let options = {mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000};        
            const recordedBlobs = [];   // Start a new stream every time when start is pressed
            // const recordedBlobs = this.props.recordedBlobs.slice();  // Append to the current stream every time when start is pressed            
            const stream = this.props.videoLiv.srcObject;
            
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
        
                        react_props.setRecordedBlobs(recordedBlobs);
                    }
                }    
                catch(error) {
                    console.log('Error in handleDataAvailable: ', error);
                }               
            }

            // Collect 10ms of data at a time => ondataavailable event is then called to push the data into buffer
            mediaRecorder.start(10);
            console.log('MediaRecorder started', mediaRecorder);

            this.props.setMediaRecorder(mediaRecorder);
        }
    }
    
    stopRecording(e) {
        if(this.props.mediaRecorder) {            
            if (this.props.mediaRecorder.state !== "inactive") {
                this.props.mediaRecorder.stop();
                console.log('Recorded Blobs: ', this.props.recordedBlobs);                                              
            }
        }
    }
    
    streamVideo(e) {
        const superBuffer = new Blob(this.props.recordedBlobs, {type: 'video/webm'});
        const video = this.props.videoRec;

        if (video) {
            // Check HTML5 compatibility
            const supportsVideo = !!document.createElement('video').canPlayType;
            if (!supportsVideo) {
                // Turn on inline video control bar
                video.controls = true;

                // Turn off "right click menu"
                video.addEventListener('contextmenu', (e) => { 
                    // do something here... 
                    e.preventDefault(); 
                }, false); 
            }

            video.src = window.URL.createObjectURL(superBuffer);
            video.pause();
            video.currentTime = 0;                
        }
    }

    render() {

        return (
            <React.Fragment>
                <button onClick={(e) => this.recordVideo(e)} className={this.context.btnFG}>Record</button>
                <button onClick={(e) => this.stopRecording(e)} className={this.context.btnFG}>Stop</button>
                <button onClick={(e) => this.streamVideo(e)} className={this.context.btnFG}>Stream</button>                  
            </React.Fragment>
        );
    }  
}

class RecordControlBar extends React.Component {

    static contextType = ThemeContext;

    render() {

        return (
            <div className="VideoControls">
                <OpenDeviceControl {...this.props.opendeviceprops}/>  
                <RecordControl {...this.props.recordcontrolprops}/>  
            </div>                   
        );
    } 
    
}    

class PlayControlBar extends React.Component {

    static contextType = ThemeContext;

    play(e) {
        const video = this.props.video;
        if (video) {
            (video.paused || video.ended) ? video.play() : video.pause();
        }        
    }

    stop(e) {
        const video = this.props.video;
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }    

    mute(e) {        
        const video = this.props.video;
        if (video) {            
            video.muted = !video.muted;
        }
    }

    volinc(e) {        
        const video = this.props.video;
        if (video) {
            const currentVolume = Math.floor(video.volume * 10) / 10;
            if (currentVolume < 1) video.volume += 0.1;
        }
    }

    voldec(e) {        
        const video = this.props.video;
        if (video) {
            const currentVolume = Math.floor(video.volume * 10) / 10;
            if (currentVolume > 0) video.volume -= 0.1;
        }
    }

    download() {
        const blob = new Blob(this.props.recordedBlobs, {type: 'video/webm'});
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

        return (
            <div className="VideoControls">
                <button onClick={(e) => this.play(e)} className={this.context.btnFG}>Play</button>
                <button onClick={(e) => this.stop(e)} className={this.context.btnFG}>Stop</button>
                <button onClick={(e) => this.mute(e)} className={this.context.btnFG}>Mute</button>
                <button onClick={(e) => this.volinc(e)} className={this.context.btnFG}>+</button>
                <button onClick={(e) => this.voldec(e)} className={this.context.btnFG}>-</button>
                <button onClick={(e) => this.download(e)} className={this.context.btnFG}>Download</button>                    
            </div>                    
        );
    }       
}

export { PlayControlBar, OpenDeviceControl, RecordControl, RecordControlBar };