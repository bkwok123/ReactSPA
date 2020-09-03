import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import Clarifai from 'clarifai';
import '../css/facedetection.css';
import FaceRecognition from '../component/facerecognition';
import FaceDetectionControl from '../component/facedetectioncontrol';
import ImageIcon from '../component/imageicon';
import ModalBox from '../component/modalbox';

class FaceDetection extends Component {

    static contextType = ThemeContext;

    constructor() {
        super();
        this.state = {
            app: new Clarifai.App ({apiKey: "b2d7a7095fd44de5b803b822204b6b4d"}),
            input: '',
            imgURL: '',
            imgsize: {},
            box: [],
            icons: {k1: {
                        url: "https://samples.clarifai.com/face-det.jpg",
                        boxdata:
                            {
                            outputs: [{
                                data: {
                                regions: [
                                    {region_info:{bounding_box: {top_row: 0.30806005, left_col: 0.21253838, bottom_row: 0.4773681, right_col: 0.30402377}}},
                                    {region_info:{bounding_box: {top_row: 0.2116047, left_col: 0.68157023, bottom_row: 0.35884228, right_col: 0.74484473}}},
                                    {region_info:{bounding_box: {top_row: 0.41287383, left_col: 0.77967566, bottom_row: 0.5900016, right_col: 0.8505466}}}
                                ]}}],
                            status: {code: 10000, description: "Ok", req_id: "51216f4580ec4fa0a356dcfa478aa865"}
                            }
                        }
                    },
            errorMsg: "",
        }
    }

    componentDidMount () {
        window.addEventListener("resize", this.updateImageSize);
    }

    componentDidUpdate () {

        const imgsize = this.getImageSize();
        if((this.state.imgsize.width !== imgsize.width) || (this.state.imgsize.height !== imgsize.height)) {
            this.setState({imgsize: imgsize});
        }
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

    async detectface (parent, imgURL, icons, newKey) {
        try {
            // Send byte file if local file is used or web link if web resource is used
            let base64 = imgURL;
            const n = base64.search("base64,");
            base64 = base64.substring(n+7);
            const img = n > 1 ? base64 : imgURL
        
            // Call third party API to identify face locations
            const response = await parent.state.app.models.predict(
                Clarifai.FACE_DETECT_MODEL, img);

            icons[newKey] = {url: imgURL, boxdata: response};            
            const box = parent.calculateFaceLocation(response);                                 
            parent.setState({imgURL: imgURL, icons: icons, box: box, imgsize: parent.getImageSize()});            
        } catch (error) {
            parent.onClickModal ("idErrmodal");
            parent.setState({box: [], errorMsg: `Failed to detect image. ${error}`});
        }
    }

    // Called on change by pasting image URL
    // example link:
    // https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F20%2F2020%2F07%2F19%2Ftiaras-2.jpg
    // https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ5w5KoZUITaB5-DqiKzvbEWYwetwxpNiPu5w&usqp=CAU
    // https://jooinn.com/images/people-8.jpg
    onChangeImgURL () {
        const img = document.getElementById("idInputImgLink");
        if (img.value !== "") {
            const icons = this.state.icons;
            const newKey = `k${Object.keys(icons).length+1}`;

            // Icons and Image are updated first to improve page refresh time on web page
            icons[newKey] = {url: img.value};
            this.setState({imgURL: img.value, icons: icons});
            this.onClickCloseModal("idFDmodal"); 

            // Icons and Image are updated again along with face boxes in detectface function
            // to display the face boxes with correct locations and sizes
            this.detectface(this, img.value, icons, newKey);
        }        
    }

    // Called on change by using browse button to upload image
    onChangeUpload (parent) {
        const img = document.getElementById("idImgFileSelector");
        if (img.files.length > 0) {
            // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
            // Convert local file to base64 for API consumption
            this.handleFile(parent, img.files[0]);                          
        }
    }     

    handleFile (parent, file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const icons = parent.state.icons;
            const newKey = `k${Object.keys(icons).length+1}`;

            // Icons and Image are updated first to improve page refresh time on web page
            icons[newKey] = {url: reader.result};
            parent.setState({imgURL: reader.result, icons: icons}); 
            parent.onClickCloseModal("idFDmodal");

            // Icons and Image are updated again along with face boxes in detectface function
            // to display the face boxes with correct locations and sizes
            parent.detectface(parent, reader.result, icons, newKey);            
        }
    }

    onClickIcon (e) {
        let key = e.target.id;
        let box = [];
        key = key.substring(key.search("k"));

        if ("boxdata" in this.state.icons[key]) {
            box = this.calculateFaceLocation(this.state.icons[key].boxdata);
        }
        this.setState({imgURL: e.target.src, box: box});
    }

    onClickModal (id) {
        const modal = document.getElementById(id);
        modal.setAttribute("class", "modalshow");
    }    

    onClickCloseModal (id){
        const modal = document.getElementById(id);
        modal.setAttribute("class", "modalhide");
    };

    // https://web.dev/read-files/
    render() {              
        return (            
            <div className={`FaceDetectionApp ${this.context.background}`}>
                <button onClick={(e) => this.onClickModal("idFDmodal")} className={`${this.context.btnFG}`}>Add Image</button>
                <ModalBox boxID="idFDmodal" hide={true} content={<FaceDetectionControl parent={this}/>} onClickModalClose={() => this.onClickCloseModal("idFDmodal")}/>
                <ModalBox boxID="idErrmodal" hide={true} content={<div className={`FaceDetectionError ${this.context.foreground}`}>{this.state.errorMsg}</div>} onClickModalClose={() => this.onClickCloseModal("idErrmodal")}/>
                <FaceRecognition imgURL={this.state.imgURL} imgsize={this.state.imgsize} box={this.state.box}/>
                <ImageIcon icons={this.state.icons} onClickIcon={(e) => this.onClickIcon(e)}/>
            </div>
        );
    }    
}

export default FaceDetection