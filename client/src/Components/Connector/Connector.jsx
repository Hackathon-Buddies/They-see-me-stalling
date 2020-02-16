import React, {Component} from 'react'
import io from 'socket.io-client';
import car from "../Models/Car";
import carImg from "../../assets/images.jpg"
import "./Connector.css"

class Connector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataMessage:{
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
        this.socket = io("http://localhost:5000"); // Add heroku URL
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
        const maxSpeed = 150;
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed < maxSpeed) {
            currentMessage.speed += accelerationSpeed;
            this.setState({dataMessage: currentMessage});
        }
        return currentMessage

    }

    breakPressed() {
        const breakingSpeed = 20;
        const minSpeed = 0;
        let currentMessage = this.state.dataMessage;
        if (currentMessage.speed - breakingSpeed >= minSpeed){
           currentMessage.speed -= breakingSpeed;
        }
        else {
            currentMessage.speed = minSpeed;
        }

        this.setState({dataMessage: currentMessage});

        return currentMessage
    }

    turningLeft() {
        let currentMessage = this.state.dataMessage;
        let maxLeft = -3;
        if (currentMessage.horizontalPosition -1 >= maxLeft){
            currentMessage.horizontalPosition -=1;
        }
        this.setState({dataMessage:currentMessage});
        return currentMessage
    }

    turningRight() {
        let currentMessage = this.state.dataMessage;
        let maxRight = 3;
        if (currentMessage.horizontalPosition + 1 <= maxRight){
            currentMessage.horizontalPosition +=1;
        }
        this.setState({dataMessage:currentMessage});
        return currentMessage
    }

    render() {

        let carImagePosition;
        switch (this.state.dataMessage.horizontalPosition) {
            case 3:
                carImagePosition ="carImage-right-3";
                break;
            case 2:
                carImagePosition ="carImage-right-2";
                break;
            case 1:
                carImagePosition ="carImage-right-1";
                break;
            case -1:
                carImagePosition ="carImage-left-1";
                break;
            case -2:
                carImagePosition ="carImage-left-2";
                break;
            case -3:
                carImagePosition ="carImage-left-3";
                break;
            default:
                carImagePosition = "carImage-middle";


        }


        return (
            <div>
                <div>
                    <p>
                        Speed ->{this.state.dataMessage.speed}
                    </p>
                    <p>
                        Clutch ->{this.state.dataMessage.isClutchDown.toString()}
                    </p>
                    <p>
                        Left/Right ->{this.state.dataMessage.horizontalPosition}
                    </p>

                </div>


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

                <img className={carImagePosition} src={carImg} alt={"car"}/>

            </div>
        );
    }
}

export default Connector