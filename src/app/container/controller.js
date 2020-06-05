import React from 'react';
import ThemeContext, { themes }  from '../context/themecontext';
import Nav from '../component/pagenav';
import Tutorial from '../../tutorial/container/tutorial';
import VideoCapture from '../../videocapture/container/videocapture';
import '../css/Theme.css';

class AppsController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeApp: <Tutorial />,
            activePage: "Tutorial",
            activeTheme: themes.dark,
        };
    } 

    toggleTheme = () => {
        this.setState({
            activeTheme: this.state.activeTheme === themes.dark ? themes.light : themes.dark,
        });        
    }

    pageClick(e) {
        let app;
        let page = e.target.alt;

        switch (e.target.alt) {
            case "Tutorial":
                app = <Tutorial />;
                break;   
            case "Video Capture":
                app = <VideoCapture />;
                break;                            
            case "Settings":
                app = this.state.activeApp;
                page = this.state.activePage;
                this.toggleTheme();
                break;                   
            default:                                                
        }

        this.setState({        
            activeApp: app,
            activePage: page,
        });        
    }

    render() {
        const switchon = false;

        return (
            <div>
                <ThemeContext.Provider value={this.state.activeTheme}>
                    <Nav.NavHeader applabel={this.state.activePage}/>                
                    {this.state.activeApp}            
                    <Nav.NavFooter on={switchon} onClick={(e) => this.pageClick(e)}/>
                </ThemeContext.Provider>
            </div>
        );

    }    
}

export default AppsController;