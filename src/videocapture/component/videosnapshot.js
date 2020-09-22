import React from 'react';
import ThemeContext from '../../app/context/themecontext';

class VideoSnapshot extends React.Component {

    static contextType = ThemeContext;

    // https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
    takepicture() {
        const context = canvas.getContext('2d');
        if (width && height) {
          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
        
          const data = canvas.toDataURL('image/png');
          photo.setAttribute('src', data);
        } else {
          clearphoto();
        }
    }

    render() {

        return (
            <div className="VideoControls">
                <OpenDeviceControl {...this.props.opendeviceprops}/>  
                <RecordControl {...this.props.recordcontrolprops}/>  
            </div>                   
        );
    } 
    
} 