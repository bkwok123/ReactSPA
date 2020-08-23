import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import Clarifai from 'clarifai';
import '../css/facedetection.css';
import FaceRecognition from '../component/facerecognition';

class FaceDetection extends Component {

    static contextType = ThemeContext;

    constructor() {
        super();
        this.state = {
            app: new Clarifai.App ({apiKey: "6cb9f81096b34514bb4f12dc54f90a13"}),
            input: '',
            imgURL: 'https://samples.clarifai.com/face-det.jpg',
            box: {},
        }
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("idInputimage");
        const coord = image.getBoundingClientRect();
        const width = Number(image.width);
        const height = Number(image.height);

        return {
            leftcol: coord.left + clarifaiFace.left_col * width,
            toprow: coord.top + clarifaiFace.top_row * height,
            rightcol: window.innerWidth - (coord.left + clarifaiFace.right_col * width),
            bottomrow: window.innerHeight - (coord.top + clarifaiFace.bottom_row * height)            
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }

    async onButtonSubmit () {
        try {         
            const response = await this.state.app.models.predict(
                // "a403429f2ddf4b49b307e318f00e528b", 
                Clarifai.FACE_DETECT_MODEL,
                this.state.imgURL);

            for (let i=0; i<response.outputs[0].data.regions.length; i++) {
                console.log("Face Detection: ", response.outputs[0].data.regions[i].region_info.bounding_box);
                this.displayFaceBox(this.calculateFaceLocation(response));
            }            
        } catch (error) {
            
        }
    }

    render() {      

        return (            
            <div className="FaceDetectionApp">
                <div className="FaceDetectionControl">
                    <button onClick={() => this.onButtonSubmit()} className={this.context.btnFG}>Submit</button>                    
                </div>
                <FaceRecognition imgURL={this.state.imgURL} box={this.state.box}/>
            </div>
        );
    }    
}

export default FaceDetection