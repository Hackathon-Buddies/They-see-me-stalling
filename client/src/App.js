import React from 'react';
import './App.css';
import {Connector} from "./Components/Connector/Connector";
import HomePage from "./Components/HomePage/HomePage";
import SelectionPage from "./Components/SelectionPage/SelectionPage";

function App() {
    return (
        <div className="App">
            <div className="rowApp">
                <HomePage/>
            </div>
        </div>
    );
}

export default App;
