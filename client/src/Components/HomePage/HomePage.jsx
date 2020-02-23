import React, {Component} from 'react';
import './HomePage.css';
import Connector from "../Connector/Connector"
import SoundComponent from "../Music/SoundComponent";
import soundfile from '../../assets/MusicAssets/BMusic.mp3'
import Sound from 'react-sound';
import Intro from "../Intro/Intro";
import SelectionPage from "../SelectionPage/SelectionPage";


class HomePage extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            isMenuShowing: true,
            playStatus: Sound.status.PLAYING
        };
    }


    handleClick() {
        this.setState({isMenuShowing: !this.state.isMenuShowing});
    }

    componentDidMount() {
        this.setState({playStatus: Sound.status.PLAYING})
    }



    render() {

        let content = (

            <div className="background">
                <button className="HomeButton1"
                        onClick={() => this.handleClick()}>
                    Click to Start
                </button>

                <SoundComponent
                    url={soundfile}
                    playStatus={this.state.playStatus}
                    autoLoad={true}
                    loop={true}
                />

            </div>
        );

        if(!this.state.isMenuShowing){
            content = (
                <Intro/>
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