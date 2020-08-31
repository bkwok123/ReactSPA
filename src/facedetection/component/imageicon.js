import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/imageicon.css';

class ImageIcon extends Component {

    static contextType = ThemeContext;

    render() {              
        const icons = [];
        
        for (let i=0; i<this.props.icons.length; i++) {
            icons.push(<img id={`idIconimage${i}`} key={i} src={this.props.icons[i].url} alt={`Icon ${i}`} onClick={(e) => this.props.onClickIcon(e)} className="image-icon"/>);
        }

        return (  
            <div className={`FaceDetectionIcon ${this.context.foreground}`}>
                {icons}
            </div>               
        );
    }
}

export default ImageIcon