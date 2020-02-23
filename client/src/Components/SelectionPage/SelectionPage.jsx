import React, {Component} from 'react';

import './SelectionPage.css';
import Connector from "../Connector/Connector";
import 'bootstrap/dist/css/bootstrap.min.css';
import io from "socket.io-client";

class SelectionPage extends Component {

    constructor(props) {
        super(props);


        this.state = {
            selector: {
                // Selectable is true
                isSelected1: true,
                isSelected2: true,
                isSelected3: true,
                isSelected4: true,


            },
            isMenuShowing: true,
            role: 0

        };
    }

    componentDidMount() {
        let uri = "http://10.77.94.144:" + 5000; // TODO: should be changed to IPv4 during demo.
        this.socket = io.connect(uri, {
            reconnectionDelay: 1000,
            reconnection: true,
            reconnectionAttempts: 10,
            transports: ['websocket'],
            agent: false,
            upgrade: false,
            rejectUnauthorized: false
        });
        console.log("connecting to server on :", uri); // Add heroku URL
        this.socket.on("roleSelectorMessage", data => {
            this.setState({selector: data});
        });

    }

    submitData(data) {
        this.setState({selector: data});
        this.socket.json.emit('roleSelectorMessage', data);
    }


    handleSelect1() {
        let currentRoleSelector = this.state.selector;
        currentRoleSelector.isSelected1 = false;
        this.setState({
            isSelected1: !this.state.isSelected1,
            role: 1
        });
        return currentRoleSelector

    }

    handleSelect2() {
        let currentRoleSelector = this.state.selector;
        currentRoleSelector.isSelected2 = false;
        this.setState({
            isSelected2: !this.state.isSelected2,
            role: 2
        });
        return currentRoleSelector;

    }

    handleSelect3() {
        let currentRoleSelector = this.state.selector;
        currentRoleSelector.isSelected3 = false;
        this.setState({
            isSelected3: !this.state.isSelected3,
            role: 3
        });

        return currentRoleSelector;

    }

    handleSelect4() {
        let currentRoleSelector = this.state.selector;
        currentRoleSelector.isSelected4 = false;
        this.setState({
            isSelected4: !this.state.isSelected4,
            role: 4
        });
        return currentRoleSelector;

    }

    handleMenuClick() {
        let currentRoleSelector = this.state.selector;
        this.setState({isMenuShowing: !this.state.isMenuShowing});
        return currentRoleSelector;
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
                    <h1 className="victory"> They see me stallin </h1>
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

                    {this.state.selector.isSelected1 ? <a className="ButtonDiv"
                                                 target="_blank" onClick={() => this.submitData(this.handleSelect1())}>Direction
                        Manager</a> : null}
                </div>
                <div> {this.state.selector.isSelected2 ? <a className="ButtonDiv"
                                                   target="_blank" onClick={() => this.submitData(this.handleSelect2())}>Pedals
                    Controller</a> : null}</div>
                <div> {this.state.selector.isSelected3 ? <a className="ButtonDiv"
                                                   target="_blank" onClick={() => this.submitData(this.handleSelect3())}>Gears
                    Lead</a> : null}</div>
                <div>  {this.state.selector.isSelected4 ? <a className="ButtonDiv"
                                                    target="_blank" onClick={() => this.submitData(this.handleSelect4())}>Clutch
                    Supervisor</a> : null}</div>
                <div>
                    {!this.state.selector.isSelected1 && !this.state.selector.isSelected2 && !this.state.selector.isSelected3 && !this.state.selector.isSelected4 ?
                        <a className="ButtonDiv"
                           target="_blank" onClick={() => this.handleMenuClick()}>Start Game</a> : null}
                </div>
                {/*<div>*/}
                {/*    {this.state.role===1?<a className="ButtonDiv">sas</a>:null}*/}
                {/*</div>*/}

            </div>


        );
        if (this.state.role === 1) {
            console.log("role=1")
        }


        if (!this.state.isMenuShowing) {
            content = (
                <Connector role={this.state.role}/>
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