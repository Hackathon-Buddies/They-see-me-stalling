import React, {Component} from 'react'
import io from 'socket.io-client';
import carImg from "../../assets/images.jpg"
import npcCar from "../../assets/npc-car.png"
import "./Connector.css"
import '../../App.css';
import "../Road/RoadAnimations.css"
import {LeftRoadSide, RightRoadSide, sideAnimationController} from "../Road/RoadSide";
import ReactDOM from "react-dom";


const port = 5000; // Server port. TODO: import form server.js once they are under the same src

export default class Connector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataMessage: {
                horizontalPosition: 0,
                verticalPosition: 0,
                speed: 0,
                currentGear: 0,
                isClutchDown: false,
                isAccelerating: false,
                isBraking: false,
                currentHealth: 100,
                showingNPCinLane1: false,
                showingNPCinLane2: false,
                showingNPCinLane3: false,

            }
        };
    }

    componentDidMount() {
        let uri = "http://10.77.86.173:" + port; // TODO: should be changed to IPv4 during demo.
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
        this.socket.on("message", data => {
            this.setState({dataMessage: data});
        });
    }

    submitData(data) {
        this.setState({dataMessage: data});
        this.socket.json.emit('message', data);
    }

    clutchDown(){
        console.log("clutch pedal pressed");
        let currentMessage = this.state.dataMessage;
        currentMessage.isClutchDown = true;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    clutchUp(){
        console.log("clutch pedal released");
        let currentMessage = this.state.dataMessage;
        currentMessage.isClutchDown = false;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    accelerateDown(){
        console.log("Accelerate pedal pressed");
        let currentMessage = this.state.dataMessage;
        currentMessage.isAccelerating = true;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    accelerateUp() {
        console.log("Accelerate pedal released");
        let currentMessage = this.state.dataMessage;
        currentMessage.isAccelerating = false;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }


    brakeDown(){
        console.log("Break pedal pressed");
        let currentMessage = this.state.dataMessage;
        currentMessage.isBraking = true;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    brakeUp(){
        console.log("Break pedal released");
        let currentMessage = this.state.dataMessage;
        currentMessage.isBraking = false;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    gearUp(bool) {
        let currentMessage = this.state.dataMessage;
        if(bool) {
            if (currentMessage.currentGear < 5){
                currentMessage.currentGear += 1;
            }
        } else {
            if (currentMessage.currentGear > 0){
                currentMessage.currentGear -= 1;
            }
        }
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }



    accelerate() {
        const accelerationSpeed = 5;
        const maxSpeed = this.state.dataMessage.currentGear * 20;
        console.log("max speed ->" + maxSpeed);
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed < maxSpeed) {
            currentMessage.speed += accelerationSpeed;
            this.setState({dataMessage: currentMessage});
        }
        return currentMessage
    }

    brake() {
        const breakingSpeed = 3;
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

    spawnNPC(bool, lane) {
        let currentMessage = this.state.dataMessage;
        if (lane === 1) {
            currentMessage.showingNPCinLane1 = bool;

        } else if (lane === 2) {
            currentMessage.showingNPCinLane2 = bool;
        } else if (lane === 3) {
            currentMessage.showingNPCinLane3 = bool;
        }

        this.setState({dataMessage: currentMessage});
        return currentMessage;
    }

    render() {
        let speed = this.state.dataMessage.speed;

        let horizontalPosition = this.state.dataMessage.horizontalPosition;
        let gear = this.state.dataMessage.currentGear;
        let isAccelerating = this.state.dataMessage.isAccelerating;
        let isBraking = this.state.dataMessage.isBraking;
        let clutch = this.state.dataMessage.isClutchDown;
        let carImagePosition;

        switch (this.state.dataMessage.horizontalPosition) {
            case 3:
                carImagePosition = "carImage-right-3 playerCar";
                break;
            case 2:
                carImagePosition = "carImage-right-2 playerCar";
                break;
            case 1:
                carImagePosition = "carImage-right-1 playerCar";
                break;
            case -1:
                carImagePosition = "carImage-left-1 playerCar";
                break;
            case -2:
                carImagePosition = "carImage-left-2 playerCar";
                break;
            case -3:
                carImagePosition = "carImage-left-3 playerCar";
                break;
            default:
                carImagePosition = "carImage-middle playerCar";
        }
        document.body.style.backgroundColor = "white";
        return (
            <div>
                <div>
                    <p>Showing npc lane 1 ->{this.state.dataMessage.showingNPCinLane1.toString()}</p>
                    <p>Showing npc lane 2 ->{this.state.dataMessage.showingNPCinLane2.toString()}</p>
                    <p>Showing npc lane 3 ->{this.state.dataMessage.showingNPCinLane3.toString()}</p>

                    <button
                        onMouseDown={() => this.submitData(this.accelerateDown())}
                        onMouseUp={() => this.submitData(this.accelerateUp())}
                    >
                        accelerate
                    </button>

                    <button
                        onMouseDown={() => this.submitData(this.brakeDown())}
                        onMouseUp={() => this.submitData(this.brakeUp())}
                    >
                        brake
                    </button>

                    <button
                        onMouseDown={() => this.submitData(this.clutchDown())}
                        onMouseUp={() => this.submitData(this.clutchUp())}
                    >
                        clutch
                    </button>

                    <button onClick={() => this.submitData(this.gearUp(true))}>Gear Up</button>
                    <button onClick={() => this.submitData(this.gearUp(false))}>Gear Down</button>

                    <button onClick={() => this.submitData(this.turningLeft())}>
                        left
                    </button>

                    <button onClick={() => this.submitData(this.turningRight())}>
                        right
                    </button>


                </div>


                <div className="row">
                    {/*TODO: change these into css classes*/}
                    <div style={{"marginRight": "90%"}}>
                        <LeftRoadSide speed={speed}/>
                    </div>
                    <TestCarAndControls
                        carPosition={carImagePosition}
                        speed={speed}
                        clutch={clutch}
                        horizontalPosition={horizontalPosition}
                        gear={gear}
                        isAccelerating = {isAccelerating}
                        accelerate = {this.accelerate.bind(this)}
                        isBraking = {isBraking}
                        brake = {this.brake.bind(this)}
                        showingNPCinLane1={this.state.dataMessage.showingNPCinLane1}
                        showingNPCinLane2={this.state.dataMessage.showingNPCinLane2}
                        showingNPCinLane3={this.state.dataMessage.showingNPCinLane3}
                        spawnNPC={this.spawnNPC.bind(this)}
                    />
                    {/*TODO: change these into css classes*/}
                    <div style={{"marginLeft": "90%"}}>
                        <RightRoadSide speed={speed}/>
                    </div>

                </div>
            </div>
        );
    }
}


/// Connector ends here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



export class TestCarAndControls extends Component {

    /**
     *  Player position stuff
     */

    constructor(props) {
        super(props);
        this.playerRef = React.createRef();
        this.npcRef1 = React.createRef();
        this.npcRef2 = React.createRef();
        this.npcRef3 = React.createRef();
        this.state = {gameTimer: 0, collision: false}
    }


    componentDidMount() {
        // Game time handler
        this.gameTimeInterval = setInterval(() => {
            this.setState(({gameTimer}) => ({
                gameTimer: gameTimer + 1
            }));
            if (this.props.isAccelerating){
                this.props.accelerate();
            }
            if (this.props.isBraking){
                this.props.brake();
            }
        }, 300)

    }

    componentDidUpdate() {
        let playerPosition = this.positionBindingHandler(this.playerRef.current);
        let npc1Position = this.positionBindingHandler(this.npcRef1.current);
        let npc2Position = this.positionBindingHandler(this.npcRef2.current);
        let npc3Position = this.positionBindingHandler(this.npcRef3.current);

        // console.log("previous state: ", prevState);

        if (!this.state.collision) {
            this.collisionController(
                this.positionBindingHandler(this.playerRef.current),
                this.positionBindingHandler(this.npcRef1.current),
                this.positionBindingHandler(this.npcRef2.current),
                this.positionBindingHandler(this.npcRef3.current));
        }
        console.log("collision: ", this.state.collision);
        if(this.props.isAccelerating){
            console.log("Should accelerate");
            //this.props.accelerate();
        }
    }


    componentWillUnmount() {
        clearInterval(this.gameTimeInterval)
    }

    positionBindingHandler = (ref) => {
        return ReactDOM.findDOMNode(ref).getBoundingClientRect();
    };

    collisionHandler(playerPosition, npcPosition,) {

        const positionVariant = 90; // A relative value for error because detection may not be pixel perfect.

        let playerX = playerPosition.x;
        let playerY = playerPosition.y;

        let npcX = npcPosition.x;
        let npcY = npcPosition.y;

        return Math.abs(playerX - npcX) < positionVariant && (Math.abs(playerY - npcY) < positionVariant);

    }

    npcSpawnHandler(lanePosition, speed) {
        let animationClass = "";
        if (this.props.showingNPCinLane1) {
            animationClass = `carImage-left-3 npcCarImage${npcAnimationHandler(speed)}`;
        }

        if (this.props.showingNPCinLane2) {
            animationClass = `carImage-middle npcCarImage${npcAnimationHandler(speed)}`;
        }

        if (this.props.showingNPCinLane3) {
            animationClass = `carImage-right-3 npcCarImage${npcAnimationHandler(speed)}`;
        }
        return animationClass

    };

    collisionController(playerPosition, npc1Position, npc2Position, npc3Position) {
        if (
            this.collisionHandler(
                playerPosition,
                npc1Position
            )) {
            this.setState({collision: true});
            console.log("collision detected at lane 1")
        }
        if (
            this.collisionHandler(
                playerPosition,
                npc2Position
            )) {
            this.setState({collision: true});
            console.log("collision detected lane 2")
        }
        if (
            this.collisionHandler(
                playerPosition,
                npc3Position
            )) {
            this.setState({collision: true});
            console.log("collision detected lane 3")

        }

    }


    render() {
        let carImagePosition = this.props.carPosition;
        let speed = this.props.speed;
        let horizontalPosition = this.props.horizontalPosition;
        let gear = this.props.gear;
        let isAccelerating = this.props.isAccelerating;
        let isBraking = this.props.isBraking;
        let clutch = this.props.clutch;

        let npc1Class = this.npcSpawnHandler(1, speed);
        let npc2Class = this.npcSpawnHandler(2, speed);
        let npc3Class = this.npcSpawnHandler(3, speed);

        return (
            <div>
                <div>
                    <div>
                        <button onClick={() => {
                            this.props.spawnNPC(true, 1);
                            this.npcSpawnHandler(1, speed);
                        }}>true 1
                        </button>
                        <button onClick={() => {
                            this.props.spawnNPC(false, 1)
                        }}>false 1
                        </button>

                        <button onClick={() => {
                            this.props.spawnNPC(true, 2);
                            this.npcSpawnHandler(2, speed);
                        }}>true 2</button>
                        <button onClick={() => this.props.spawnNPC(false, 2)}>false 2</button>

                        <button onClick={() => {
                            this.props.spawnNPC(true, 3);
                            this.npcSpawnHandler(3, speed);
                        }}>true 3</button>
                        <button onClick={() => this.props.spawnNPC(false, 3)}>false 3</button>
                        <p>
                            Speed ->{speed}
                        </p>
                        <p>
                            Left/Right ->{horizontalPosition}
                        </p>
                        <p>
                            Gear ->{gear}
                        </p>
                        <p>
                            isAccelerating ->{isAccelerating.toString()}
                        </p>
                        <p>
                            isBraking ->{isBraking.toString()}
                        </p>
                        <p>
                            Clutch ->{clutch.toString()}
                        </p>
                    </div>
                    <div className="carDiv">
                        <img className={carImagePosition} ref={this.playerRef} src={carImg} alt={"car"}/>
                        <img className={npc1Class} ref={this.npcRef1} src="{npcCar}" alt={"npcCar1"}/>
                        <img className={npc2Class} ref={this.npcRef2} src="{npcCar}" alt={"npcCar2"}/>
                        <img className={npc3Class} ref={this.npcRef3} src="{npcCar}" alt={"npcCar3"}/>
                    </div>
                </div>
            </div>

        );
    }
}





const npcAnimationHandler = (speed) => {

    let npcAnimation;


    switch (true) {

        case (speed <= 0):
            npcAnimation = "";
            break;

        case (1 < speed && speed < 19):
            npcAnimation = " npc-animation-speed-1";
            break;
        case (19 < speed && speed < 29):

            npcAnimation = " npc-animation-speed-2";
            break;
        case (29 < speed && speed < 39):

            npcAnimation = " npc-animation-speed-3";
            break;
        case (30 < speed && speed < 49):

            npcAnimation = " npc-animation-speed-4";
            break;
        case (49 < speed && speed < 59):

            npcAnimation = " npc-animation-speed-5";
            break;
        case (59 < speed && speed < 69):

            npcAnimation = " npc-animation-speed-6";
            break;

        case (69 < speed && speed < 79):

            npcAnimation = " npc-animation-speed-7";
            break;

        case (79 < speed):

            npcAnimation = " npc-animation-speed-7";
            break;


    }

    return npcAnimation

};
