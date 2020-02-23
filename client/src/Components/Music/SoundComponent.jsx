import React, { Component } from 'react';
import Sound from 'react-sound';


export default class SoundComponent extends Component{
    render(){
        return (
            <React.Fragment>
                <Sound {...this.props} />
            </React.Fragment>
            )
    }
}