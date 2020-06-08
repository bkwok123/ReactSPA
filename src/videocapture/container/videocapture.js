import React from 'react';
import ThemeContext from '../../app/context/themecontext';
import { RecordControlBar, PlayControlBar} from '../component/mediacontrol';
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
            minbuttons: [],
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

    // Hide video panel
    hide(e) {        
        const parent = e.target.parentNode;
        const grandparent = parent.parentNode;
        grandparent.className = grandparent.className + " hideBox";
        const list = this.state.minbuttons;

        const el = document.querySelector("div.VideoMinMenu");
        if (el) {
            list.push(<button onClick={(e) => this.unhide(e)} key={grandparent.id}>{grandparent.id}</button>);
            this.setState({        
                minbuttons: list,            
            });
        }
    }

    // Only call this when context to change theme is used, as the class to create "hidden"
    // effect is not in the original render element
    // The object to be hidden and unhidden must contains a unique id as well
    rehide() {
        const el = document.querySelector("div.VideoMinMenu");
        let el_hidden = document.querySelector("div.hideBox");

        if(el) {
            if (!el_hidden) {
                for (let i=0; i < el.children.length; i++) {
                    console.log(el.children[i].key);
                    el_hidden = document.querySelector("#" + el.children[i].textContent);
                    console.log(el_hidden);
                    el_hidden.className = el_hidden.className + " hideBox";
                }
            }
        }

    }

    // Unhide hidden video panel
    unhide(e) {
        
        const el = document.querySelector("div.hideBox");
        const list = this.state.minbuttons;

        if (el) {
            let class_name = el.getAttribute("class").replace(" hideBox","");
            el.setAttribute("class",class_name);          
            
            const newlist = list.filter(item => item.key !== e.target.textContent);

            this.setState({        
                minbuttons: newlist,            
            });
        }

    }

    componentDidUpdate() {
        this.rehide();
    }

    render() {

        const playcontrolprops = {
                                    video: this.videoRecRef.current, 
                                    recordedBlobs: this.state.recordedBlobs
                                }

        const opendeviceprops = {
            videoLiv: this.videoLivRef.current, 
            constraints: this.state.constraints,
            controls: this.state.controls,
            setLiveVideo: (stream, switchOn) => this.setLiveVideo(stream, switchOn),
        }

        const recordcontrolprops = {
            videoLiv: this.videoLivRef.current,
            videoRec: this.videoRecRef.current,
            mediaRecorder: this.state.mediaRecorder,
            recordedBlobs: this.state.recordedBlobs,
            setMediaSource: (mediaSource) => this.setMediaSource(mediaSource),
            setMediaRecorder: (mediaRecorder) => this.setMediaRecorder(mediaRecorder),
            setRecordedBlobs: (recordedBlobs) => this.setRecordedBlobs(recordedBlobs),
        }        

        return (            

            <div className={`VideoApp ${this.context.background}`}>
                <div id="Live" className={`VideoBox ${this.context.background}`}>                    
                    <video autoPlay muted playsInline ref={this.videoLivRef} className={this.context.foreground}></video>
                    <RecordControlBar opendeviceprops={opendeviceprops} recordcontrolprops={recordcontrolprops} />

                    <div className="VideoTopMenu">
                        <button onClick={(e) => this.hide(e)} className={this.context.btnFG}>Hide</button>
                    </div>                     
                </div>

                <div id="Recorded" className={`VideoBox ${this.context.background}`}>                 
                    <video autoPlay loop playsInline ref={this.videoRecRef} className={this.context.foreground}></video>
                    <PlayControlBar {...playcontrolprops} />

                    <div className="VideoTopMenu">
                        <button onClick={(e) => this.hide(e)} className={this.context.btnFG}>Hide</button>
                    </div>                                         
                </div>                            

                <div className={`VideoMinMenu ${this.context.chdbtn}`}>
                    {this.state.minbuttons}
                </div>
            </div>
        );
    } 

}

export default VideoCapture