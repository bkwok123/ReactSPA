import React from 'react';
import ThemeContext from '../../app/context/themecontext';
import Media from '../component/mediacontrol';
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

    setDeviceControlState(switchOn) {
        this.setState({        
            controls:   {
                sourceON: switchOn,
            },
        })  
    }

    // Used by Open Device Component
    setLiveVideo(stream, switchOn) {
        this.videoLivRef.current.srcObject = stream;
        this.setDeviceControlState(switchOn);
    }

    // Used by Record Component
    setMediaSource(mediaSource) {
        this.setState({        
            mediaSource: mediaSource,            
        })        
    }

    // Used by Record Component
    setRecordedBlobs(recordedBlobs) {
        this.setState({        
            recordedBlobs: recordedBlobs,            
        }) 
    }

    // Used by Record Component
    setMediaRecorder(mediaRecorder) {
        this.setState({        
            mediaRecorder: mediaRecorder,            
        }) 
    }

    render() {

        return (            

            <div className={`VideoApp ${this.context.background}`}>
                <div className={`VideoBox ${this.context.background }`}>                    
                    <video id="live" autoPlay muted playsInline ref={this.videoLivRef} className={this.context.foreground}></video>
                    <div className="VideoControls">
                        <Media.OpenDeviceControl video={this.videoLivRef.current} constraints={this.state.constraints} controls={this.state.controls} setLiveVideo={(stream, switchOn) => this.setLiveVideo(stream, switchOn)}/>  
                        <Media.RecordControl videoLiv={this.videoLivRef.current} 
                                             videoRec={this.videoRecRef.current} 
                                             mediaRecorder={this.state.mediaRecorder}
                                             recordedBlobs={this.state.recordedBlobs}
                                             setMediaSource={(mediaSource) => this.setMediaSource(mediaSource)}
                                             setMediaRecorder={(mediaRecorder) => this.setMediaRecorder(mediaRecorder)}
                                             setRecordedBlobs={(recordedBlobs) => this.setRecordedBlobs(recordedBlobs)}/>  
                    </div>                                        
                </div>

                <div className={`VideoBox ${this.context.background }`}>                 
                    <video id="recorded" autoPlay loop playsInline ref={this.videoRecRef} className={this.context.foreground}></video>
                    <Media.PlayControl video={this.videoRecRef.current} recordedBlobs={this.state.recordedBlobs}/>                    
                </div>
            </div>
        );
    } 

}

export default VideoCapture