import React, { Component } from 'react';

class UserLoginDropDown extends Component {
    render() {
        var name = localStorage.getItem('name');
        var avatar = localStorage.getItem('avatar');

        return (
            <li className="dropdown dropdown-user dropdown-dark">
                <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <img alt="" className="img-circle" src={avatar} />
                    <span className="username username-hide-mobile">{name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-default">
                    <li>
                        <a href="extra_profile.html">
                            <i className="icon-user"></i> My Profile </a>
                    </li>
                    <li>
                        <a href="page_calendar.html">
                            <i className="icon-calendar"></i> My Calendar </a>
                    </li>
                    <li>
                        <a href="inbox.html">
                            <i className="icon-envelope-open"></i> My Inbox <span className="badge badge-danger">
                                3 </span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i className="icon-rocket"></i> My Tasks <span className="badge badge-success">
                                7 </span>
                        </a>
                    </li>
                    <li className="divider">
                    </li>
                    <li>
                        <a href="extra_lock.html">
                            <i className="icon-lock"></i> Lock Screen </a>
                    </li>
                    <li>
                        <a href="/Login">
                            <i className="icon-key"></i> Log Out </a>
                    </li>
                </ul>
            </li>
        );
    }
}

export default UserLoginDropDown;