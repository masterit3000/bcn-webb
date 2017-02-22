import React, { Component } from 'react';

class NotificationDropDown extends Component {
    render() {
        return (
            <li className="dropdown dropdown-extended dropdown-dark dropdown-notification" id="header_notification_bar">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className="icon-bell"></i>
                    <span className="badge badge-default">7</span>
                </a>
                <ul className="dropdown-menu">
                    <li className="external">
                        <h3>You have <strong>12 pending</strong> tasks</h3>
                        <a href="#">view all</a>
                    </li>
                    <li>
                        <ul className="dropdown-menu-list scroller" style={{ height: '250px' }} data-handle-color="#637283">
                            <li>
                                <a href="#">
                                    <span className="time">just now</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-success">
                                            <i className="fa fa-plus"></i>
                                        </span>
                                        New user registered. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">3 mins</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-danger">
                                            <i className="fa fa-bolt"></i>
                                        </span>
                                        Server #12 overloaded. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">10 mins</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-warning">
                                            <i className="fa fa-bell-o"></i>
                                        </span>
                                        Server #2 not responding. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">14 hrs</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-info">
                                            <i className="fa fa-bullhorn"></i>
                                        </span>
                                        Application error. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">2 days</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-danger">
                                            <i className="fa fa-bolt"></i>
                                        </span>
                                        Database overloaded 68%. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">3 days</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-danger">
                                            <i className="fa fa-bolt"></i>
                                        </span>
                                        A user IP blocked. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">4 days</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-warning">
                                            <i className="fa fa-bell-o"></i>
                                        </span>
                                        Storage Server #4 not responding dfdfdfd. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">5 days</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-info">
                                            <i className="fa fa-bullhorn"></i>
                                        </span>
                                        System Error. </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="time">9 days</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-danger">
                                            <i className="fa fa-bolt"></i>
                                        </span>
                                        Storage server failed. </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        );
    }
}

export default NotificationDropDown;