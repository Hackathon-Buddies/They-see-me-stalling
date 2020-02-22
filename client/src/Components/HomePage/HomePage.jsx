import React, {Component} from 'react';
import './HomePage.css';
import Connector from "../Connector/Connector"

class HomePage extends Component  {

    state = {
        isMenuShowing: true
    };

    handleClick() {
        this.setState({isMenuShowing: !this.state.isMenuShowing});
    }


    render() {

        let content = (

            <div className="background">
                <button className="HomeButton"
                        onClick={() => this.handleClick()}>
                    Click to Start
                </button>
            </div>
        );

        if(!this.state.isMenuShowing){
            content = (
             <Connector/>
            );
        }
        document.body.style.backgroundColor = "#000F42";
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default HomePage;