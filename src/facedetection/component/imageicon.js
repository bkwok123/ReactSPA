import React, { Component } from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/imageicon.css';

class ImageIcon extends Component {

    static contextType = ThemeContext;

    render() {              
        const icons = [];
        const max = 10;
        const maxoffset = Object.keys(this.props.icons).length - max;
        const offset = this.props.offset;
        let i = 0;
        for (const [key, value] of Object.entries(this.props.icons)) {
            if ((offset<=i) && (i < (max + offset))) {
                icons.push(<img id={`idIconimage${key}`} key={key} src={value.url} alt={`Icon ${key}`} onClick={(e) => this.props.onClickIcon(e)} className="image-icon"/>);
            }
            i = i+1;            
        }        

        return (  
            <div className={`FaceDetectionIcon ${this.context.foreground}`}>
                {icons}
                <a className="image-icon-prev" onClick={() => this.props.onClickPrevIcon()}>❮</a>
                <a className="image-icon-next" onClick={() => this.props.onClickNextIcon(maxoffset)}>❯</a>
            </div>               
        );
    }
}

export default ImageIcon