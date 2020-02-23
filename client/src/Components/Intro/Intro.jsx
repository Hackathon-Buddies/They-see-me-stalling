import React, { Component } from 'react';
import PeterGif from "../../assets/IntroAssets/Peter.gif";
import AndreiGif from "../../assets/IntroAssets/Andrei.gif"
import FemiGif from "../../assets/IntroAssets/Femi.gif"
import TomasGif from "../../assets/IntroAssets/Tomas.gif"
import './Intro.css'
import SelectionPage from "../SelectionPage/SelectionPage";

export default class SoundComponent extends Component {
    state={
        scripts : [
            "This is the 3d store we’ve hit so far "
            ,"Yeah it is literally a cakewalk "
            ,"Good thinking stealing your mom’s car Andrei"
            ,"Oh no we hit the alarm "],
        images : [PeterGif,AndreiGif,FemiGif,TomasGif],
        currentScript: 0,
    };
    changeScript = () =>{
        let nextIndex = this.state.currentScript + 1;
        this.setState({currentScript:nextIndex});
    };
    skipClick(){
        this.setState({currentScript: this.state.scripts.length})
    }
    render() {
        let maxLength = this.state.scripts.length;
        let content = (
            <React.Fragment>


                <div className="cutsceneGif">
                    <img  alt={"perter"} src={this.state.images[this.state.currentScript]}/>
                </div>


                <div className="cutscenenText">
                    <div class= "IntroText">
                        {this.state.scripts[this.state.currentScript]}
                    </div>


                    <div className="IntroButton">
                        <button className="floated1" onClick={() => this.changeScript()}>Next</button>
                        <button className="floated2" onClick={() => this.skipClick()}> Skip</button>
                    </div>

                </div>


            </React.Fragment>
        );


        if (this.state.currentScript === maxLength){
            content = (
                <SelectionPage/>
            );
        }
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        )
    }
}


