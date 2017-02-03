import React, { Component } from 'react';
import Menu from './Menu';
import Logo from './Logo';
import TopNavMenu from './TopNavMenu';

class Header extends Component {
    render() {

        return (
            <div className="page-header">
                <div className="page-header-top">
                    <div className="container-fluid">
                        <Logo />
                        <TopNavMenu />
                    </div>
                </div>
                <Menu />
            </div>
        );
    }
}

export default Header;