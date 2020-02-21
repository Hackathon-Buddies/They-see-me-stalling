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

        case (1 < speed && speed < 19):
            sideAnimation = "sideImg side-animation-speed-1";
            break;
        case (19 < speed && speed < 29):
            sideAnimation = "sideImg side-animation-speed-2";
            break;
        case (29 < speed && speed < 39):
            sideAnimation = "sideImg side-animation-speed-3";
            break;
        case (30 < speed && speed < 49):
            sideAnimation = "sideImg side-animation-speed-4";
            break;
        case (49 < speed && speed < 59):
            sideAnimation = "sideImg side-animation-speed-5";
            break;
        case (59 < speed && speed < 69):
            sideAnimation = "sideImg side-animation-speed-6";
            break;

        case (69 < speed && speed < 79):
            sideAnimation = "sideImg side-animation-speed-7";
            break;

        case (79 < speed):
            sideAnimation = "sideImg side-animation-speed-7";
            break;


    }

    return sideAnimation

};
