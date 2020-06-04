import React from 'react';
import ThemeContext from '../../app/context/themecontext';
import '../css/tutorial.css';

class EvolvU extends React.Component {

    static contextType = ThemeContext;

    render() {

        return (
            <div className={`TutorialContent ${this.context.background}`}>
                <h1>Git Command</h1>
                <h2>Create a new repository on the command line</h2>
                <ol className="notelist">
                    <li>echo "# cohort4-reactcrud" >> README.md</li>
                    <li>git init</li>
                    <li>git add README.md</li>
                    <li>git commit -m "first commit"</li>
                    <li>git remote add origin https://github.com/username/user-repository.git</li>
                    <li>git push -u origin master</li>                    
                </ol>
                <h2>Push an existing repository from the command line</h2>
                <ol className="notelist">
                    <li>git remote add origin https://github.com/username/user-repository.git</li>
                    <li>git push -u origin master</li>
                </ol>
                <h2>Check in updated files</h2>
                <ol className="notelist">
                    <li>git remote -v</li>                    
                    <li>git pull</li>
                    <li>add .</li>
                    <li>git status</li>
                    <li>git commit -m"Updated comment"</li>
                    <li>git status</li>
                    <li>git push</li>
                </ol>                                               
            </div>
        );
    }    

}

export default EvolvU