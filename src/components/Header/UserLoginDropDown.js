import React, { Component } from 'react';
import { Link } from 'react-router';

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
                        <Link to="/Account">
                            <i className="icon-user"></i>Tài khoản
                        </Link>
                    </li>
                    {/*<li className="divider">
                    </li>*/}
                    <li>
                        <Link to="/Login">
                            <i className="icon-key"></i>Đăng xuất
                        </Link>
                    </li>
                </ul>
            </li>
        );
    }
}

export default UserLoginDropDown;