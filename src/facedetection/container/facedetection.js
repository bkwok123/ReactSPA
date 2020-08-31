import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import Clarifai from 'clarifai';
import '../css/facedetection.css';
import FaceRecognition from '../component/facerecognition';
import FaceDetectionControl from '../component/facedetectioncontrol';
import ImageIcon from '../component/imageicon';

class FaceDetection extends Component {

    static contextType = ThemeContext;

    constructor() {
        super();
        this.state = {
            app: new Clarifai.App ({apiKey: "b2d7a7095fd44de5b803b822204b6b4d"}),
            input: '',
            imgURL: 'https://samples.clarifai.com/face-det.jpg',
            imgsize: {},
            box: [],
            icons: {k1: "https://samples.clarifai.com/face-det.jpg",
                    k2: "https://jooinn.com/images/people-8.jpg"
            },
        }
    }

    componentDidMount () {
        window.addEventListener("resize", this.updateImageSize);
    }

    componentWillUnmount () {
        window.removeEventListener("resize", this.updateImageSize);
    }

    // Calculate box locations to hightlight a human face based on result returned
    // by Clarifai API
    // https://www.clarifai.com/model-gallery
    // https://docs.clarifai.com/api-guide/predict/images
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

    async onClickDetect (parent) {
        try {
            // Send byte file if local file is used or web link if web resource is used
            let base64 = parent.state.imgURL;
            const n = base64.search("base64,");
            base64 = base64.substring(n+7);
            const img = n > 1 ? base64 : parent.state.imgURL
        
            // Call third party API to identify face locations
            const response = await parent.state.app.models.predict(
                Clarifai.FACE_DETECT_MODEL, img);

            // Save calculated face locations in React component states
            parent.displayFaceBox(parent.calculateFaceLocation(response));         
        } catch (error) {
            console.log("Error Message: ", error, " with image: ", parent.state.imgURL);
            alert("Error in detection: ", parent.state.imgURL, error);
        }
    }

    // example link:
    // https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F20%2F2020%2F07%2F19%2Ftiaras-2.jpg
    // https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ5w5KoZUITaB5-DqiKzvbEWYwetwxpNiPu5w&usqp=CAU
    // https://jooinn.com/images/people-8.jpg
    onChangeImg () {
        const img = document.getElementById("idInputImgLink");
        if (img.value !== "") {
            this.setState({imgURL: img.value});
        }        
    }

    onChangeUpload (parent) {
        const img = document.getElementById("idImgFileSelector");
        if (img.files.length > 0) {
            // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
            // Convert local file to base64 for API consumption
            const reader = new FileReader();
            reader.readAsDataURL(img.files[0]);
            reader.onloadend = () => {
                parent.setState({imgURL: reader.result});
            }                                  
        }
    }     

    // https://web.dev/read-files/
    render() {              
        return (            
            <div className={`FaceDetectionApp ${this.context.background}`}>
                <FaceDetectionControl parent={this}/>
                <FaceRecognition imgURL={this.state.imgURL} imgsize={this.state.imgsize} box={this.state.box}/>             
                <ImageIcon icons={this.state.icons}/>
            </div>
        );
    }    
}

export default FaceDetection