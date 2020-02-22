import React from 'react';
import './App.css';
import {Connector} from "./Components/Connector/Connector";
import HomePage from "./Components/HomePage/HomePage";

function App() {
    return (
        <div className="App">
            <div className="row">
                <HomePage/>
            </div>
        </div>
    );
}

export default App;
