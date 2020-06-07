import React from 'react';
import ThemeContext from '../context/themecontext';
import '../css/Footer.css';
import '../css/Header.css';
import simg from "../image/book.svg";
import mimg from "../image/media.svg";
import thimg from "../image/theme.svg";


class NavHeader extends React.Component {

    static contextType = ThemeContext;

    render() {
        return (
            <nav className={`zone sticky ${this.context.zone} ${this.context.navt} ${this.context.glow}`}>
                <ul className="main-nav">
                    <li>
                        <label id="modulelabel">{this.props.applabel}</label>
                    </li>   
                    <li className="push">
                        <label id="credentiallabel">{this.props.credential}</label>
                        <label id="classlabel">{this.props.currentController}</label>
                    </li>      
                </ul>    
                
                <div className="zone red warning">
                    <label id="warninglabel">{this.props.warninglabel}</label>
                </div>      
            </nav>
        );
    }    
}

class NavFooter extends React.Component {

    static contextType = ThemeContext;
        
    render() {
        return (
            <footer className={`zone bottom-nav stickyb ${this.context.navb}`}>
                <div>
                    <input type="image" src={simg} alt="Tutorial" className={`navbox ${this.context.navicon}`} disabled={this.props.on} onClick={this.props.onClick}></input>
                    <input type="image" src={mimg} alt="Video Capture" className={`navbox ${this.context.navicon}`} disabled={this.props.on} onClick={this.props.onClick}></input>
                    <input type="image" src={thimg} alt="Settings" className={`navbox ${this.context.navicon}`} disabled={this.props.on} onClick={this.props.onClick}></input>
                </div>
            </footer>
        );
    }
}

export default {NavHeader, NavFooter};