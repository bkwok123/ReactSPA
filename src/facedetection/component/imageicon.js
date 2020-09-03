import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/imageicon.css';

class ImageIcon extends Component {

    static contextType = ThemeContext;

    render() {              
        const icons = [];        

        for (const [key, value] of Object.entries(this.props.icons)) {
            icons.push(<img id={`idIconimage${key}`} key={key} src={value.url} alt={`Icon ${key}`} onClick={(e) => this.props.onClickIcon(e)} className="image-icon"/>);
        }        

        return (  
            <div className={`FaceDetectionIcon ${this.context.foreground}`}>
                {icons}
            </div>               
        );
    }
}

export default ImageIcon