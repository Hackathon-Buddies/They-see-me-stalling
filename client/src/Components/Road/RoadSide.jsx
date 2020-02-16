import React, {Component} from "react";
import treeImg from "../../assets/test-tree.png"
import "./RoadAnimations.css"

export class LeftRoadSide extends Component {
    render() {
        let speed = this.props.speed;
        return (
            <div className="leftSideColumn">

                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>

            </div>
        );
    }
}

export class RightRoadSide extends Component {
    render() {
        let speed = this.props.speed;
        return (
            <div className="rightSideColumn">
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>
                <img src={treeImg} alt={"tree"} className={sideAnimationController(speed)}/>

            </div>
        );
    }

}

const sideAnimationController = (speed) => {

    let sideAnimation;


    switch (true) {

        case (speed <= 0):
            console.log("stopped at speed: ", speed)
            sideAnimation = "sideImg";
            break;

        case (1 < speed && speed < 19):
            console.log("speed animation 1 at speed: ", speed);
            sideAnimation = "sideImg side-animation-speed-1";
            break;
        case (19 < speed && speed < 29):
            console.log("speed animation 2 at speed: ", speed);

            sideAnimation = "sideImg side-animation-speed-2";
            break;
        case (29 < speed && speed < 39):
            console.log("speed animation 3 at speed: ", speed);

            sideAnimation = "sideImg side-animation-speed-3";
            break;
        case (30 < speed && speed < 49):
            console.log("speed animation 4 at speed: ", speed);

            sideAnimation = "sideImg side-animation-speed-4";
            break;
        case ( 49 < speed && speed < 59):
            console.log("speed animation 5 at speed: ", speed);

            sideAnimation = "sideImg side-animation-speed-5";
            break;
        case ( 59 < speed && speed < 69):
            console.log("speed animation 6 at speed: ", speed);

            sideAnimation = "sideImg side-animation-speed-6";
            break;

        case ( 69 < speed && speed < 79):
            console.log("speed animation 7 at speed: ", speed);

            sideAnimation = "sideImg side-animation-speed-7";
            break;

        case ( 79 < speed):
            console.log("speed animation 7 at speed: ", speed);

            sideAnimation = "sideImg side-animation-speed-7";
            break;


    }

    return sideAnimation

};
