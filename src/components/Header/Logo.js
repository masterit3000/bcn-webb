import React, { Component } from 'react';
import logo from './logo-akido.png';

class Logo extends Component {
    render() {
        return (
            <div className="page-logo">
                <a href="/ListDevices"><img src={logo} alt="logo" style={{margin: '-12.5px 0px 0px' , height: '120px'}} className="logo-default" /></a>
            </div>
        );
    }
}

export default Logo;