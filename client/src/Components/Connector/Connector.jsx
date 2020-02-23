import React, {Component} from 'react'
import io from 'socket.io-client';
import "./Connector.css"
import '../../App.css';
import "../Road/RoadAnimations.css"
import {LeftRoadSide, RightRoadSide, sideAnimationController} from "../Road/RoadSide";
import ReactDOM from "react-dom";
import player_idle from "../../assets/carGifs/movement/player-idle.png"
import player_speed_1 from "../../assets/carGifs/movement/player-speed-1.gif"
import player_speed_2 from "../../assets/carGifs/movement/player-speed-2.gif"
import player_speed_3 from "../../assets/carGifs/movement/player-speed-3.gif"
import player_speed_4 from "../../assets/carGifs/movement/player-speed-4.gif"
import player_speed_5 from "../../assets/carGifs/movement/player-speed-5.gif"
import player_stall from "../../assets/carGifs/stall/player-stall.gif"
import player_stall_idle from "../../assets/carGifs/stall/player-stall-idle.gif"
import acceleration_up from "../../assets/controls/accelerationUp.png"
import acceleration_down from "../../assets/controls/accelerationDown.png"
import brake_up from "../../assets/controls/brakeUp.png"
import brake_down from "../../assets/controls/brakeDown.png"
import clutch_up from "../../assets/controls/clutchUp.png"
import clutch_down from "../../assets/controls/clutchDown.png"
import gear_0 from "../../assets/controls/gear-0.png"
import gear_1 from "../../assets/controls/gear-1.png"
import gear_2 from "../../assets/controls/gear-2.png"
import gear_3 from "../../assets/controls/gear-3.png"
import gear_4 from "../../assets/controls/gear-4.png"
import gear_5 from "../../assets/controls/gear-5.png"
import wheel_neutral from "../../assets/controls/wheel-neutral.png"
import wheel_left from "../../assets/controls/wheel-left.png"
import wheel_right from "../../assets/controls/wheel-right.png"
import {RoadStripLeft, RoadStripRight} from "../RoadStrip/RoadStrip";
import obstacle1 from "../../assets/obstacles/obstacle-1.png"
import obstacle2 from "../../assets/obstacles/obstacle-2.png"
import obstacle3 from "../../assets/obstacles/obstacle-3.png"
import obstacle4 from "../../assets/obstacles/obstacle-4.png"
import lane_closed from "../../assets/controls/laneClosed.jpeg"
import down_arrow from "../../assets/controls/down_arrow.png"
import up_arrow from "../../assets/controls/up_arrow.png"
import blue_left from "../../assets/controls/blue_left.png"
import blue_right from "../../assets/controls/blue_right.png"
import red_left from "../../assets/controls/red_left.png"
import red_right from "../../assets/controls/red_right.png"



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
                turningLeft: false,
                turningRight: false,
                stalled: false,
                showingNPCinLane1: false,
                showingNPCinLane2: false,
                showingNPCinLane3: false
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

    clutchDown() {
        console.log("clutch pedal pressed");
        let currentMessage = this.state.dataMessage;
        currentMessage.isClutchDown = true;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    clutchUp() {
        console.log("clutch pedal released");
        let currentMessage = this.state.dataMessage;
        if (currentMessage.stalled === true) {
            const minSpeed = (currentMessage.currentGear - 1) * 20;
            const maxSpeed = currentMessage.currentGear * 20;
            const currentSpeed = currentMessage.speed;
            if (currentSpeed <= maxSpeed && currentSpeed >= minSpeed) {
                currentMessage.stalled = false;
            }
        }
        currentMessage.isClutchDown = false;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    accelerateDown() {
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


    brakeDown() {
        console.log("Break pedal pressed");
        let currentMessage = this.state.dataMessage;
        currentMessage.isBraking = true;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    brakeUp() {
        console.log("Break pedal released");
        let currentMessage = this.state.dataMessage;
        currentMessage.isBraking = false;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    gearUp(bool) {
        let currentMessage = this.state.dataMessage;
        if (currentMessage.isClutchDown) {
            if (bool) {
                if (currentMessage.currentGear < 5) {
                    currentMessage.currentGear += 1;
                    if (currentMessage.speed + 30 < currentMessage.currentGear * 20) {
                        currentMessage.stalled = true;
                    }
                }
            } else {
                if (currentMessage.currentGear > 0) {
                    currentMessage.currentGear -= 1;
                }
            }
            this.setState({dataMessage: currentMessage});
        }
        return currentMessage
    }


    accelerate() {
        const accelerationSpeed = 1;
        const maxSpeed = this.state.dataMessage.currentGear * 20;
        console.log("max speed ->" + maxSpeed);
        let currentMessage = this.state.dataMessage;
        if (!currentMessage.isClutchDown) {
            if (currentMessage.speed < maxSpeed && currentMessage.stalled !== true) {
                currentMessage.speed += accelerationSpeed;
                this.setState({dataMessage: currentMessage});
            }
        }
        return currentMessage
    }

    brake() {
        const breakingSpeed = 0.5;
        const minSpeed = 0;
        const stallSpeed = (this.state.dataMessage.currentGear - 1) * 20;
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed < stallSpeed && !currentMessage.isClutchDown) {
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

    turningLeft(bool) {
        console.log("Break pedal released");
        let currentMessage = this.state.dataMessage;
        currentMessage.turningLeft = bool;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    turnLeft() {
        let currentMessage = this.state.dataMessage;
        let maxLeft = -3;
        let turningSpeed = 0.1;
        if(this.state.dataMessage.speed/20 > turningSpeed){
            turningSpeed = this.state.dataMessage.speed/20;
        }
        console.log(currentMessage.horizontalPosition);
        if (currentMessage.horizontalPosition - turningSpeed >= maxLeft) {
            currentMessage.horizontalPosition -= turningSpeed;
            this.setState({dataMessage: currentMessage});
        } else {
            currentMessage.horizontalPosition = maxLeft;
            this.setState({dataMessage: currentMessage});
        }

        return currentMessage
    }

    turningRight(bool) {
        let currentMessage = this.state.dataMessage;
        currentMessage.turningRight = bool;
        this.setState({dataMessage: currentMessage});
        return currentMessage
    }

    turnRight() {
        let currentMessage = this.state.dataMessage;
        let maxRight = 3;
        let turningSpeed = 0.1;
        if(this.state.dataMessage.speed/20 > turningSpeed){
            turningSpeed = this.state.dataMessage.speed/20;
        }
        console.log(currentMessage.horizontalPosition);
        currentMessage.horizontalPosition += turningSpeed;
        if (currentMessage.horizontalPosition + turningSpeed <= maxRight) {
            currentMessage.horizontalPosition += turningSpeed;
            this.setState({dataMessage: currentMessage});
        } else {
            currentMessage.horizontalPosition = maxRight;
            this.setState({dataMessage: currentMessage});
        }
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
        let turningLeft = this.state.dataMessage.turningLeft;
        let turningRight = this.state.dataMessage.turningRight;
        let carImagePosition;
        let accelerationImg = acceleration_up;
        let brakeImg = brake_up;
        let clutchImg = clutch_up;
        let gearImg = "";

        switch (gear) {
            case 1:
                gearImg = gear_1;
                break;
            case 2:
                gearImg = gear_2;
                break;
            case 3:
                gearImg = gear_3;
                break;
            case 4:
                gearImg = gear_4;
                break;
            case 5:
                gearImg = gear_5;
                break;
            default:
                gearImg = gear_0;
                break;
        }

        let wheelImg = wheel_neutral;
        let rightSignalImg = blue_right;
        let leftSignalImg = blue_left;

        if(turningLeft){
            wheelImg = wheel_left;
            leftSignalImg = red_left;
        }
        if(turningRight){
            wheelImg = wheel_right;
            rightSignalImg = red_right;
        }

        if (isAccelerating){
            accelerationImg = acceleration_down;
        }

        if(isBraking){
            brakeImg = brake_down;
        }

        if(clutch){
            clutchImg = clutch_down;
        }

        switch (Math.floor(this.state.dataMessage.horizontalPosition)) {
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
                <div className="Controls">
                    <img
                        className="ControlButton5"
                        src={down_arrow}
                        alt="gearUpPic"
                        onClick={() => this.submitData(this.gearUp(true))}
                    />
                    <img
                        className="ControlImage1"
                        src={gearImg}
                        alt="gearPic"
                    />
                    <img
                        className="ControlButton6"
                        src={up_arrow}
                        alt="gearDownPic"
                        onClick={() => this.submitData(this.gearUp(false))}
                    />
                    <img
                        className="ControlImage2"
                        src={clutchImg}
                        alt="clutchPic"
                        onMouseDown={() => this.submitData(this.clutchDown())}
                        onMouseUp={() => this.submitData(this.clutchUp())}
                    />
                    <img
                        className="ControlImage3"
                        src={brakeImg}
                        alt="brakePic"
                        onMouseDown={() => this.submitData(this.brakeDown())}
                        onMouseUp={() => this.submitData(this.brakeUp())}
                    />
                    <img
                        className="ControlImage4"
                        src={accelerationImg}
                        alt="accelerationPic"
                        onMouseDown={() => this.submitData(this.accelerateDown())}
                        onMouseUp={() => this.submitData(this.accelerateUp())}
                    />
                    <img
                        className="ControlButton7"
                        src={leftSignalImg}
                        alt="LeftPic"
                        onMouseDown={() => this.submitData(this.turningLeft(true))}
                        onMouseUp={() => this.submitData(this.turningLeft(false))}
                    />
                    <img
                        className="ControlImage5"
                        src={wheelImg}
                        alt="wheelPic"
                    />
                    <img
                        className="ControlButton1"
                        src={rightSignalImg}
                        alt="RightPic"
                        onMouseDown={() => this.submitData(this.turningRight(true))}
                        onMouseUp={() => this.submitData(this.turningRight(false))}
                    />
                </div>


                <div className="rowApp">
                    {/*TODO: change these into css classes*/}
                    <div>
                        <LeftRoadSide speed={speed}/>
                        <RoadStripLeft speed={speed}/>
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
                        turnLeft = {this.turnLeft.bind(this)}
                        turningLeft ={turningLeft}
                        turnRight = {this.turnRight.bind(this)}
                        turningRight ={turningRight}
                        showingNPCinLane1={this.state.dataMessage.showingNPCinLane1}
                        showingNPCinLane2={this.state.dataMessage.showingNPCinLane2}
                        showingNPCinLane3={this.state.dataMessage.showingNPCinLane3}
                        spawnNPC={this.spawnNPC.bind(this)}
                    />
                    {/*TODO: change these into css classes*/}
                    <div>
                        <RoadStripRight speed={speed}/>
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
            if (this.props.isAccelerating) {
                this.props.accelerate();
            }
            if (this.props.isBraking) {
                this.props.brake();
            }
            if (this.props.stalled) {
                this.props.brake();
            }
            if (this.props.turningLeft){
                this.props.turnLeft();
            }
            if (this.props.turningRight){
                this.props.turnRight();
            }
        }, 100)

    }

    componentDidUpdate() {
        if(this.props.showingNPCinLane1 || this.props.showingNPCinLane2 || this.props.showingNPCinLane3){
            if(!this.state.collision && this.props.speed !== 0){
                this.collisionController(
                    this.positionBindingHandler(this.playerRef.current),
                    this.positionBindingHandler(this.npcRef1.current),
                    this.positionBindingHandler(this.npcRef2.current),
                    this.positionBindingHandler(this.npcRef3.current)
                );
                //console.log("collision: ", this.state.collision);
            }
        }
    }


    componentWillUnmount() {
        clearInterval(this.gameTimeInterval)
    }

    positionBindingHandler = (ref) => {
        return ReactDOM.findDOMNode(ref).getBoundingClientRect();
    };

    collisionController(playerPosition, npc1Position, npc2Position, npc3Position) {
        if(this.props.showingNPCinLane1){
            if (this.collisionHandler(playerPosition, npc1Position,1)) {
                //this.setState({collision: true});
                this.props.spawnNPC(false,1);
                console.log("collision detected at lane 1")
            }
        }
        if(this.props.showingNPCinLane2){
            if (this.collisionHandler(playerPosition, npc2Position,2)) {
                //this.setState({collision: true});
                this.props.spawnNPC(false,2);
                console.log("collision detected lane 2")
            }
        }
        if(this.props.showingNPCinLane3){
            if (this.collisionHandler(playerPosition, npc3Position,3)) {
                //this.setState({collision: true});
                this.props.spawnNPC(false,3);
                console.log("collision detected lane 3")
            }
        }
    }

    collisionHandler(playerPosition, npcPosition, lane) {
        const positionVariant = 90; // A relative value for error because detection may not be pixel perfect.
        const playerX = playerPosition.x + playerPosition.height/2;
        const playerY = playerPosition.y + playerPosition.width/2;
        const npcX = npcPosition.x + npcPosition.height/2;
        const npcY = npcPosition.y - npcPosition.width/2;

        if (lane === 1 && npcPosition.y > 700) {
            this.props.spawnNPC(false,1);
        } else if (lane === 2 && npcPosition.y > 700) {
            this.props.spawnNPC(false,2);
        } else if (lane === 3 && npcPosition.y > 700) {
            this.props.spawnNPC(false,3);
        }
        //console.log("npcY ->"+ npcPosition.y);

        return Math.abs(playerX - npcX) < positionVariant && (Math.abs(playerY - npcY) < positionVariant);
    }

    npcSpawnHandler(lanePosition, speed) {
        let animationClass = "";
        if (lanePosition === 1) {
            animationClass = "carImage-left-3 npcCarImage";
            if (this.props.showingNPCinLane1) {
                animationClass += npcAnimationHandler(speed);
            }
        }
        if (lanePosition === 2) {
            animationClass = "carImage-middle npcCarImage";
            if (this.props.showingNPCinLane2) {
                animationClass += npcAnimationHandler(speed);
            }
        }
        if (lanePosition === 3) {
            animationClass = "carImage-right-3 npcCarImage";
            if (this.props.showingNPCinLane3) {
                animationClass += npcAnimationHandler(speed);
            }
        }
        return animationClass
    };


    render() {
        let carImagePosition = this.props.carPosition;
        let speed = this.props.speed;
        let horizontalPosition = this.props.horizontalPosition;
        let gear = this.props.gear;
        let isAccelerating = this.props.isAccelerating;
        let isBraking = this.props.isBraking;
        let clutch = this.props.clutch;
        let stalled = this.props.stalled;
        let turningLeft = this.props.turningLeft;
        let turningRight = this.props.turningRight;

        let npc1Class = this.npcSpawnHandler(1, speed);
        let npc2Class = this.npcSpawnHandler(2, speed);
        let npc3Class = this.npcSpawnHandler(3, speed);

        let lane1Img;
        let lane2Img;
        let lane3Img;

        let carImage = null;

        if (stalled) {
            if (speed > 0) {
                carImage = player_stall;
            } else {
                carImage = player_stall_idle;
            }

        } else {
            if (speed > 0 && speed < 21) {
                carImage = player_speed_1;
            } else if (speed > 20 && speed < 41) {
                carImage = player_speed_2;
            } else if (speed > 40 && speed < 61) {
                carImage = player_speed_3;
            } else if (speed > 60 && speed < 81) {
                carImage = player_speed_4;
            } else if (speed > 80) {
                carImage = player_speed_5;
            } else {
                carImage = player_idle;
            }
        }

        let images = [obstacle1, obstacle2, obstacle3, obstacle4];
        let npcImg = images[Math.floor(speed%images.length)];
        return (
            <div>
                <div className="SpawningButtons Controls">
                    {this.props.showingNPCinLane1 ? null :
                        <img
                            className="ControlButton2"
                            src={lane_closed}
                            onClick={() => {
                                this.props.spawnNPC(true, 1);
                                this.npcSpawnHandler(1, speed);}
                            }
                        />
                    }
                    {this.props.showingNPCinLane2 ? null :
                        <img
                            className="ControlButton3"
                            src={lane_closed}
                            onClick={() => {
                                this.props.spawnNPC(true, 2);
                                this.npcSpawnHandler(2, speed);}
                            }
                        />
                    }
                    {this.props.showingNPCinLane3 ? null :
                        <img
                            className="ControlButton4"
                            src={lane_closed}
                            onClick={() => {
                                this.props.spawnNPC(true, 3);
                                this.npcSpawnHandler(3, speed);}
                            }
                        />
                    }
                    <p className ="Speedometer">
                        Current Speed:{speed}
                    </p>
                </div>
                <div className="carDiv">
                    <img className={carImagePosition} ref={this.playerRef} src={carImage} alt={"car"}/>
                    <img className={npc1Class} ref={this.npcRef1} src={npcImg} alt={"npcCar1"}/>
                    <img className={npc2Class} ref={this.npcRef2} src={npcImg} alt={"npcCar2"}/>
                    <img className={npc3Class} ref={this.npcRef3} src={npcImg} alt={"npcCar3"}/>
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

