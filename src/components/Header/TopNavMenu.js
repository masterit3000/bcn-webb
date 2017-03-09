import React, { Component } from 'react';
import NotificationDropDown from './NotificationDropDown';
import InboxDropDown from './InboxDropDown';
import UserLoginDropDown from './UserLoginDropDown';

class componentName extends Component {
    render() {
        return (
            <div className="top-menu">
                <ul className="nav navbar-nav pull-right">
                    {/*<NotificationDropDown />*/}
                    <li className="droddown dropdown-separator">
                        <span className="separator"></span>
                    </li>
                    {/*<InboxDropDown />*/}
                    {/*<!-- BEGIN USER LOGIN DROPDOWN -->*/}
                    <UserLoginDropDown />
                    {/*<!-- END USER LOGIN DROPDOWN -->*/}
                </ul>
            </div>
        );
    }
}

export default componentName;