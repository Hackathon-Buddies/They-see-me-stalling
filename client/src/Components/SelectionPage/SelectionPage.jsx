import React, {Component} from 'react';

import './SelectionPage.css';
import Connector from "../Connector/Connector";
import 'bootstrap/dist/css/bootstrap.min.css';

class SelectionPage extends Component  {

    state = {
        isMenuShowing: true,
        isSelected1: true,
        isSelected2: true,
        isSelected3: true,
        isSelected4: true,
        role:0

    };

    handleClick() {

        this.setState({isMenuShowing: !this.state.isMenuShowing});
    }
    handleSelect1(){
        this.setState({isSelected1: !this.state.isSelected1, role: 1});


    }
    handleSelect2(){
        this.setState({isSelected2: !this.state.isSelected2});

    }
    handleSelect3(){
        this.setState({isSelected3: !this.state.isSelected3});

    }
    handleSelect4(){
        this.setState({isSelected4: !this.state.isSelected4});

    }
    handleRole(){


    }



    render() {

        let content = (

            <div className="backgroundSelect">
                {/*<x-sign>*/}
                {/*    <h3>*/}
                {/*        SELECT YOUR ROLE*/}
                {/*    </h3>*/}
                {/*</x-sign>*/}
                <div>
                    {/*<h1 className = "victory"> <span className = "victory-v" > C </span> Car chase </h1>*/}
                    <h1 className = "victory">  Car chase </h1>
                </div>
                <br>
                </br>
                <br>
                </br><br>
            </br>
                <div>
                    <a className="chrome">Choose a role</a>
                </div>

                <div>

                    { this.state.isSelected1 ?<a  className="ButtonDiv"
                               target="_blank" onClick={() => this.handleSelect1()}>Direction Manager</a>: null }
                </div>
                <div> { this.state.isSelected2 ?<a  className="ButtonDiv"
                         target="_blank" onClick={() => this.handleSelect2()}>Pedals Controller</a>: null }</div>
                <div> { this.state.isSelected3 ?<a  className="ButtonDiv"
                         target="_blank" onClick={() => this.handleSelect3()}>Gears Lead</a>: null }</div>
                <div>  { this.state.isSelected4 ?<a  className="ButtonDiv"
                          target="_blank" onClick={() => this.handleSelect4()}>Clutch Supervisor</a>: null }</div>
                <div>
                    { !this.state.isSelected1&&!this.state.isSelected2&&!this.state.isSelected3&&!this.state.isSelected4 ?<a  className="ButtonDiv"
                                                 target="_blank" onClick={() => this.handleClick()}>Start Game</a>: null }
                </div>
                {/*<div>*/}
                {/*    {this.state.role===1?<a className="ButtonDiv">sas</a>:null}*/}
                {/*</div>*/}

                </div>





        );
        if(this.state.role===1){
            console.log("role=1")
        }


        if(!this.state.isMenuShowing){
            content = (
                <Connector/>
            );
        }

        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default SelectionPage;