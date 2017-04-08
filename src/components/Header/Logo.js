import React, { Component } from 'react';
import logo from './logo-akido.png';

class Logo extends Component {
    render() {
        return (
            <div className="page-logo">
                <a href="/"><img src={logo} alt="logo" style={{margin: '10.5px 0 0 0' , height: '50px'}} className="logo-default" /></a>
            </div>
        );
    }
}

export default Logo;