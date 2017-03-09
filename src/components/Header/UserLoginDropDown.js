import React, { Component } from 'react';

class UserLoginDropDown extends Component {
    render() {
        var name = localStorage.getItem('name');
        var avatar = localStorage.getItem('avatar');

        return (
            <li className="dropdown dropdown-user dropdown-dark">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <img alt="" className="img-circle" src={avatar} />
                    <span className="username username-hide-mobile">{name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-default">
                    <li>
                        <a href="/Account">
                            <i className="icon-user"></i>Tài khoản</a>
                    </li>
                    <li className="divider">
                    </li>
                    <li>
                        <a href="/Login">
                            <i className="icon-key"></i>Đăng xuất</a>
                    </li>
                </ul>
            </li>
        );
    }
}

export default UserLoginDropDown;