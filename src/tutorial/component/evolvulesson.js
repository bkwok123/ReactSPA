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
                    <li>echo "# user-repository" >> README.md</li>
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

                <h1>React App</h1>
                <h2>Create a React App</h2>
                <ol className="notelist">
                    <li>Switch to code root folder</li>
                    <li>npx create-reat-app app-name</li>
                </ol>                                                               
                <h2>Run a react app</h2>
                <ol className="notelist">
                    <li>npm start</li>
                </ol>

                <h1>Pytest</h1>
                <h2>Run all Tests in a suit</h2>
                <ol className="notelist">
                    <li>pipenv shell</li>
                    <li>pytest -k test_suit -s</li>
                </ol>                  
                <h2>Run one of the Tests in a suit</h2>
                <ol className="notelist">
                    <li>pipenv shell</li>
                    <li>pytest -k test1 test_suit.py -s</li>
                </ol>      
                <h2>Run Script</h2>
                <ol className="notelist">
                    <li>pipenv shell</li>
                    <li>python main.py</li>
                </ol>                                                                                                                                                          
            </div>
        );
    }    

}

export default EvolvU