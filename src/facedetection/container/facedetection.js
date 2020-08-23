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
            box: [],
        }
    }

    // Calculate box locations to hightlight a human face based on result returned
    // by Clarifai API
    calculateFaceLocation = (data) => {
                
        const image = document.getElementById("idInputimage");
        const coord = image.getBoundingClientRect();
        const width = Number(image.width);
        const height = Number(image.height);
        
        const box = [];
        let clarifaiFace;

        for (let i=0; i<data.outputs[0].data.regions.length; i++) {

            clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;

            // Calculate right column and bottom row based on the size of inner window
            // window.screen size may be off due to margin set in css
            box.push({
                leftcol: coord.left + clarifaiFace.left_col * width,
                toprow: coord.top + clarifaiFace.top_row * height,
                rightcol: window.innerWidth - (coord.left + clarifaiFace.right_col * width),
                bottomrow: window.innerHeight - (coord.top + clarifaiFace.bottom_row * height)   
            });
        }         

        return box;
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }

    async onButtonSubmit () {
        try {         
            const response = await this.state.app.models.predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.imgURL);

            this.displayFaceBox(this.calculateFaceLocation(response));         

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