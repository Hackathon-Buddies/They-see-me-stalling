import React, {Component} from "react";
import treeImg from "../../assets/test-tree.png"
import "./RoadAnimations.css";
import ReactDOM from 'react-dom';


export class LeftRoadSide extends Component {


    constructor(props) {
        super(props);
        this.treeRef1 = React.createRef();
        this.state = {gameTimer: 0};
    }

    componentDidMount() {
        this.gameTimeInterval = setInterval(() => {
            this.setState(({gameTimer}) => ({
                gameTimer: gameTimer + 1
            }))
        }, 1000)
    }


    componentDidUpdate() {
        this.positionBindingHandler(this.treeRef1.current);
    }

    componentWillUnmount() {
        clearInterval(this.gameTimeInterval)
    }


    positionBindingHandler = (ref) => {
        return ReactDOM.findDOMNode(ref).getBoundingClientRect();
    };


    render() {
        let speed = this.props.speed;
        return (
            <div className="leftSideColumn">

                <img src={treeImg} ref={this.treeRef1} alt={"tree"} className={sideAnimationController(speed)}/>
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
            sideAnimation = "sideImg";
            break;

        case (0 < speed && speed < 19):
            sideAnimation = "sideImg side-animation-speed-1";
            break;
        case (18 < speed && speed < 29):
            sideAnimation = "sideImg side-animation-speed-2";
            break;
        case (28 < speed && speed < 39):
            sideAnimation = "sideImg side-animation-speed-3";
            break;
        case (38 < speed && speed < 49):
            sideAnimation = "sideImg side-animation-speed-4";
            break;
        case (48 < speed && speed < 59):
            sideAnimation = "sideImg side-animation-speed-5";
            break;
        case (58 < speed && speed < 69):
            sideAnimation = "sideImg side-animation-speed-6";
            break;

        case (68 < speed && speed < 79):
            sideAnimation = "sideImg side-animation-speed-7";
            break;

        case (78 < speed):
            sideAnimation = "sideImg side-animation-speed-8";
            break;
    }
    return sideAnimation
};
