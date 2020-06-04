import React from 'react';
import ThemeContext from '../../app/context/themecontext';
import EvolvuLesson from '../component/evolvulesson';
import '../css/tutorial.css';

class Tutorial extends React.Component {

    static contextType = ThemeContext;

    render() {

        return (
            <div className={`TutorialApp ${this.context.background}`}>
                <EvolvuLesson/>
            </div>
        );
    }  
}

export default Tutorial