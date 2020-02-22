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
                stalled: false,
                showingNPCinLane1: false,
                showingNPCinLane2: false,
                showingNPCinLane3: false
            }
        };
    }

    componentDidMount() {
        let uri = "http://localhost:" + port; // TODO: should be changed to IPv4 during demo.
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
        if(currentMessage.stalled === true) {
            const minSpeed = (currentMessage.currentGear - 1) * 20;
            const maxSpeed = currentMessage.currentGear * 20;
            const currentSpeed = currentMessage.speed;
            if (currentSpeed <= maxSpeed && currentSpeed >= minSpeed){
                currentMessage.stalled = false;
            }
        }
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
        if (currentMessage.isClutchDown){
            if(bool) {
                if (currentMessage.currentGear < 5){
                    currentMessage.currentGear += 1;
                    if(currentMessage.speed + 30 < currentMessage.currentGear * 20) {
                        currentMessage.stalled = true;
                    }
                }
            } else {
                if (currentMessage.currentGear > 0){
                    currentMessage.currentGear -= 1;
                }
            }
            this.setState({dataMessage: currentMessage});
        }
        return currentMessage
    }



    accelerate() {
        const accelerationSpeed = 5;
        const maxSpeed = this.state.dataMessage.currentGear * 20;
        console.log("max speed ->" + maxSpeed);
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed < maxSpeed && currentMessage.stalled !== true) {
            currentMessage.speed += accelerationSpeed;
            this.setState({dataMessage: currentMessage});
        }
        return currentMessage
    }

    brake() {
        const breakingSpeed = 3;
        const minSpeed = 0;
        const stallSpeed = (this.state.dataMessage.currentGear - 1) * 20;
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed < stallSpeed && !currentMessage.isClutchDown){
            console.log("You stalled mofo!!!");
            currentMessage.stalled = true;
        }
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
        let stalled = this.state.dataMessage.stalled;
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
                        stalled = {stalled}
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
            if (this.props.stalled){
                this.props.brake();
            }
        }, 300)

    }

    componentDidUpdate() {
        if (!this.state.collision) {
            this.collisionController(
                this.positionBindingHandler(this.playerRef.current),
                this.positionBindingHandler(this.npcRef1.current),
                this.positionBindingHandler(this.npcRef2.current),
                this.positionBindingHandler(this.npcRef3.current)
            );
        }
        console.log("collision: ", this.state.collision);
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
        if (lanePosition === 1){
            animationClass = "carImage-left-3 npcCarImage";
            if (this.props.showingNPCinLane1) {
                animationClass += npcAnimationHandler(speed);
            }
        }
        if (lanePosition === 2){
            animationClass = "carImage-middle npcCarImage";
            if (this.props.showingNPCinLane2) {
                animationClass += npcAnimationHandler(speed);
            }
        }
        if (lanePosition === 3){
            animationClass = "carImage-right-3 npcCarImage";
            if (this.props.showingNPCinLane3) {
                animationClass += npcAnimationHandler(speed);
            }
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
        let stalled = this.props.stalled;

        let npc1Class = this.npcSpawnHandler(1, speed);
        let npc2Class = this.npcSpawnHandler(2, speed);
        let npc3Class = this.npcSpawnHandler(3, speed);

        return (
            <div>
                <div className="Buttons">
                    {this.props.showingNPCinLane1 ? null :
                            <button onClick={() => {
                                this.props.spawnNPC(true, 1);
                                this.npcSpawnHandler(1, speed);
                            }}>Spawn car in lane 1
                            </button>
                    }
                    {this.props.showingNPCinLane2 ? null :
                        <button onClick={() => {
                            this.props.spawnNPC(true, 2);
                            this.npcSpawnHandler(2, speed);
                        }}>Spawn car in lane 2
                        </button>
                    }
                    {this.props.showingNPCinLane3 ? null :
                        <button onClick={() => {
                            this.props.spawnNPC(true, 3);
                            this.npcSpawnHandler(3, speed);
                        }}>Spawn car in lane 3
                        </button>
                    }
                    <p>
                        Speed ->{speed}
                    </p>
                    <p>
                        Left/Right ->{horizontalPosition}
                    </p>
                    <p>
                        Gear ->{gear}
                    </p>
                    <div>
                        <p>isAccelerating ->{isAccelerating.toString()} </p>
                        <p>isBraking ->{isBraking.toString()}</p>
                        <p>Clutch ->{clutch.toString()} </p>
                        <p>Stalled ->{stalled.toString()}</p>
                    </div>
                </div>

                <div className="carDiv">
                    <img className={carImagePosition} ref={this.playerRef} src={carImg} alt={"car"}/>

                    <img className={npc1Class} ref={this.npcRef1} src={npcCar} alt={"npcCar1"}/>
                    <img className={npc2Class} ref={this.npcRef2} src={npcCar} alt={"npcCar2"}/>
                    <img className={npc3Class} ref={this.npcRef3} src={npcCar} alt={"npcCar3"}/>
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
