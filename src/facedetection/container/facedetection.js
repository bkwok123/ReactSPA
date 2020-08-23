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
            imgsize: {},
            box: [],
        }
    }

    // Calculate box locations to hightlight a human face based on result returned
    // by Clarifai API
    // https://www.clarifai.com/model-gallery
    // Test data:
    //              imgURL: 'https://samples.clarifai.com/face-det.jpg'
    //              {top_row: 0.30806005, left_col: 0.21253838, bottom_row: 0.4773681, right_col: 0.30402377}
    //              {top_row: 0.2116047, left_col: 0.68157023, bottom_row: 0.35884228, right_col: 0.74484473}
    //              {top_row: 0.41287383, left_col: 0.77967566, bottom_row: 0.5900016, right_col: 0.8505466}
    calculateFaceLocation = (data) => {
                        
        const box = [];
        let clarifaiFace;

        for (let i=0; i<data.outputs[0].data.regions.length; i++) {

            clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;

            box.push({
                leftcol: `${clarifaiFace.left_col * 100}%`,
                toprow: `${clarifaiFace.top_row * 100}%`,
                rightcol: `${(1- clarifaiFace.right_col) * 100}%`,
                bottomrow: `${(1- clarifaiFace.bottom_row) * 100}%`
            });            
        }         

        return box;
    }

    displayFaceBox = (box) => {
        const image = document.getElementById("idInputimage");
        const coord = image.getBoundingClientRect();
        const width = Number(image.width);
        const height = Number(image.height);

        this.setState({box: box, imgsize: {width: width, height: height} });
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
                <FaceRecognition imgURL={this.state.imgURL} imgsize={this.state.imgsize} box={this.state.box}/>
            </div>
        );
    }    
}

export default FaceDetection