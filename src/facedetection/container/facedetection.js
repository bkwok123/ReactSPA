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

    componentDidMount () {
        window.addEventListener("resize", this.updateImageSize);

        // Release resources
        // const img = document.getElementById('idInputimage');
        // img.onload = () => {
        //     URL.revokeObjectURL(img.src) // free memory
        // }
    }

    componentDidUpdate () {
        window.addEventListener("resize", this.updateImageSize);

        // Release resources
        // const img = document.getElementById('idInputimage');
        // img.onload = () => {
        //     URL.revokeObjectURL(img.src) // free memory
        // }              
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
        let testdata = [];
        testdata.push({top_row: 0.30806005, left_col: 0.21253838, bottom_row: 0.4773681, right_col: 0.30402377})
        testdata.push({top_row: 0.2116047, left_col: 0.68157023, bottom_row: 0.35884228, right_col: 0.74484473})
        testdata.push({top_row: 0.41287383, left_col: 0.77967566, bottom_row: 0.5900016, right_col: 0.8505466})

        for (let i=0; i<testdata.length; i++) {
        // for (let i=0; i<data.outputs[0].data.regions.length; i++) {

            // clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
            clarifaiFace = testdata[i];

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
        this.setState({box: box, imgsize: this.getImageSize() });
    }

    getImageSize = () => {
        const image = document.getElementById("idInputimage");
        const width = Number(image.width);
        const height = Number(image.height);

        return {width: width, height: height};
    }

    updateImageSize = () => {          
        // Update image size to update face detection box locations whenever window resizing
        const imgsize = this.getImageSize();      
        this.setState({imgsize: imgsize});
    }

    async onClickDetect () {
        try {         
            // const response = await this.state.app.models.predict(
            //     Clarifai.FACE_DETECT_MODEL,
            //     this.state.imgURL);
            const response=null;

            this.displayFaceBox(this.calculateFaceLocation(response));         

        } catch (error) {
            
        }
    }

    // example:
    // https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F20%2F2020%2F07%2F19%2Ftiaras-2.jpg
    onChangeImg () {
        const img = document.getElementById("idInputImgLink");
        if (img.value !== "") {
            this.setState({imgURL: img.value});
        }        
    }

    onChangeUpload () {
        const img = document.getElementById("idImgFileSelector");
        if (img.files.length > 0) {
            const imgURL = URL.createObjectURL(img.files[0]);
            this.setState({imgURL: imgURL});
        }
    }     

    render() {      

        return (            
            <div className={`FaceDetectionApp ${this.context.background}`}>
                <div className={`FaceDetectionControl ${this.context.foreground}`}>
                    <button onClick={() => this.onChangeUpload()} className={`${this.context.btnFG} fdControlB1`}>Refresh Local</button>
                    <label className={`${this.context.btnFG} fdControlB2 inputborder`}>
                        <input id="idImgFileSelector" type="file" accept=".jpg, .jpeg, .png" onChange={() => this.onChangeUpload()}></input>
                        Upload Local Image
                    </label>
                    
                    <button onClick={() => this.onChangeImg()} className={`${this.context.btnFG} fdControlB3`}>Refresh Web Link</button>
                    <label className={`${this.context.btnFG} fdControlL1`}>Enter an external link on web: </label>
                    <input id="idInputImgLink" type="text" onChange={() => this.onChangeImg()} className={`${this.context.btnFG} fdControlI1`}></input>

                    <button onClick={() => this.onClickDetect()} className={`${this.context.btnFG} fdControlB4`}>Detect</button>
                </div>
                <FaceRecognition imgURL={this.state.imgURL} imgsize={this.state.imgsize} box={this.state.box}/>
            </div>
        );
    }    
}

export default FaceDetection