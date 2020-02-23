import React, {Component} from "react";
import "../Road/RoadAnimations.css";
import roadStripImg from "../../assets/roadLine.png"
import "./RoadStrip.css"

export class RoadStripLeft extends Component {


    render() {
        let speed = this.props.speed;
        return (
            <div className={"leftRoadStrip"}>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
            </div>
        )
    }
}

export class RoadStripRight extends Component {


    render() {
        let speed = this.props.speed;
        return (
            <div className={"rightRoadStrip"}>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
                <img src={roadStripImg} alt={"roadStrip"} className={animationController(speed)}/>
            </div>
        )
    }
}


const animationController = (speed) => {

    let sideAnimation;


    switch (true) {

        case (speed <= 0):
            sideAnimation = "roadLine";
            break;

        case (0 < speed && speed < 19):
            sideAnimation = "roadLine road-animation-speed-1";
            break;
        case (18 < speed && speed < 29):
            sideAnimation = "roadLine road-animation-speed-2";
            break;
        case (28 < speed && speed < 39):
            sideAnimation = "roadLine road-animation-speed-3";
            break;
        case (38 < speed && speed < 49):
            sideAnimation = "roadLine road-animation-speed-4";
            break;
        case (48 < speed && speed < 59):
            sideAnimation = "roadLine road-animation-speed-5";
            break;
        case (58 < speed && speed < 69):
            sideAnimation = "roadLine road-animation-speed-6";
            break;

        case (68 < speed && speed < 79):
            sideAnimation = "roadLine road-animation-speed-7";
            break;

        case (78 < speed):
            sideAnimation = "roadLine road-animation-speed-8";
            break;


    }

    return sideAnimation

};
