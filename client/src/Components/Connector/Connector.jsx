import React, {Component} from 'react'
import io from 'socket.io-client';
import carImg from "../../assets/images.jpg"
import "./Connector.css"
import '../../App.css';
import {LeftRoadSide, RightRoadSide} from "../Road/RoadSide";
import ReactDOM from "react-dom";


const port = 5000; // Server port. TODO: import form server.js once they are under the same src

export class Connector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataMessage: {
                horizontalPosition: 0,
                verticalPosition: 0,
                speed: 0,
                currentGear: 0,
                isClutchDown: false,
                isShooting: false,
                currentHealth: 100
            }
        };
    }

    componentDidMount() {
        console.log("component mounted" + this.state.dataMessage);
        this.socket = io.connect("http://localhost:" + port, { // TODO: can be changed to IPv4 during demo.
            reconnectionDelay: 1000,
            reconnection: true,
            reconnectionAttempts: 10,
            transports: ['websocket'],
            agent: false,
            upgrade: false,
            rejectUnauthorized: false
        });
        console.log("connecting to server on :",); // Add heroku URL
        this.socket.on("message", data => {
            this.setState({dataMessage: data});
        });
    }

    submitData(data) {
        this.setState({dataMessage: data});
        this.socket.json.emit('message', data);
        console.log("sent message " + data);
        console.log("current message " + this.state.dataMessage)
    }

    clutchPress() {
        let currentMessage = this.state.dataMessage;
        currentMessage.isClutchDown = !currentMessage.isClutchDown;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    acceleratorPress() {
        const accelerationSpeed = 10;
        const maxSpeed = 100;
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed < maxSpeed) {
            currentMessage.speed += accelerationSpeed;
            this.setState({dataMessage: currentMessage});
        }
        return currentMessage

    }

    breakPressed() {
        const breakingSpeed = 10;
        const minSpeed = 0;
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed - breakingSpeed >= minSpeed) {
            currentMessage.speed -= breakingSpeed;
        } else {
            currentMessage.speed = minSpeed;
        }

        this.setState({dataMessage: currentMessage});

        return currentMessage
    }

    turningLeft() {
        let currentMessage = this.state.dataMessage;
        let maxLeft = -3;
        if (currentMessage.horizontalPosition - 1 >= maxLeft) {
            currentMessage.horizontalPosition -= 1;
        }
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    turningRight() {
        let currentMessage = this.state.dataMessage;
        let maxRight = 3;
        if (currentMessage.horizontalPosition + 1 <= maxRight) {
            currentMessage.horizontalPosition += 1;
        }
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    render() {

        let speed = this.state.dataMessage.speed;
        let clutch = this.state.dataMessage.isClutchDown;
        let horizontalPosition = this.state.dataMessage.horizontalPosition;


        let carImagePosition;
        switch (this.state.dataMessage.horizontalPosition) {
            case 3:
                carImagePosition = "carImage-right-3";
                break;
            case 2:
                carImagePosition = "carImage-right-2";
                break;
            case 1:
                carImagePosition = "carImage-right-1";
                break;
            case -1:
                carImagePosition = "carImage-left-1";
                break;
            case -2:
                carImagePosition = "carImage-left-2";
                break;
            case -3:
                carImagePosition = "carImage-left-3";
                break;
            default:
                carImagePosition = "carImage-middle";


        }


        return (
            <div>
                <div>
                    <button onClick={() => this.submitData(this.acceleratorPress())}>
                        accelerate
                    </button>

                    <button onClick={() => this.submitData(this.breakPressed())}>
                        brake
                    </button>

                    <button onClick={() => this.submitData(this.clutchPress())}>
                        clutch
                    </button>

                    <button onClick={() => this.submitData(this.turningLeft())}>
                        left
                    </button>

                    <button onClick={() => this.submitData(this.turningRight())}>
                        right
                    </button>
                </div>


                <div className="row">
                    {/*TODO: change these into css classes*/}
                    <div style={{"margin-right": "90%"}}>
                        <LeftRoadSide speed={speed}/>
                    </div>
                    <TestCarAndControls
                        carPosition={carImagePosition}
                        speed={speed}
                        clutch={clutch}
                        horizontalPosition={horizontalPosition}
                    />
                    {/*TODO: change these into css classes*/}
                    <div style={{"margin-left": "90%"}}>
                        <RightRoadSide speed={speed}/>
                    </div>

                </div>
            </div>


        );
    }
}


export class TestCarAndControls extends Component {

    /**
     *  Player position stuff
     */

    constructor(props) {
        super(props);
        this.playerRef = React.createRef();
        this.state = {gameTimer: 0}
    }


    componentDidMount() {
        // Game time handler
        this.gameTimeInterval = setInterval(() => {
            this.setState(({gameTimer}) => ({
                gameTimer: gameTimer + 1
            }))
        }, 1000)


    }

    componentDidUpdate() {
        this.positionBindingHandler(this.playerRef.current);
    }

    componentWillUnmount() {
        clearInterval(this.gameTimeInterval)
    }

    positionBindingHandler = (ref) => {
        let elementPosition = ReactDOM.findDOMNode(ref).getBoundingClientRect(); // use this.ref.current
        console.log("Player position is: ", elementPosition);
        return elementPosition;
    };


    render() {
        let carImagePosition = this.props.carPosition;
        let speed = this.props.speed;
        let clutch = this.props.clutch;
        let horizontalPosition = this.props.horizontalPosition;
        return (
            <div>

                <div>

                    <div>
                        <p>
                            Speed ->{speed}
                        </p>
                        <p>
                            Clutch ->{clutch.toString()}
                        </p>
                        <p>
                            Left/Right ->{horizontalPosition}
                        </p>

                    </div>


                    <img className={carImagePosition} ref={this.playerRef} src={carImg} alt={"car"}/>

                </div>
            </div>

        );
    }
}