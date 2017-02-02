import React, { Component } from 'react';
import fireMarker from './fire.png';
import normalMarker from './normal-marker.png';

class Marker extends Component {

    render() {

        const isFire = this.props.isFire;


        var markerStyle = {
            width: "25px",
            height: "auto"
        }
        function DropDown(props) {
            return (
                <li className="dropdown dropdown-extended dropdown-dark dropdown-notification" id="header_notification_bar">
                    <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                        <i className="icon-bell"></i>
                    </a>
                    <ul className="dropdown-menu">
                        <li className="external">
                            <h3>You have <strong>12 pending</strong> tasks</h3>
                            <a href="javascript:;">view all</a>
                        </li>
                    </ul>
                </li>
            );
        }
        function NormalMarker(props) {
            return (
                <div className="task-config">
                    <div className="task-config-btn btn-group">
                        <a href="javascript:;" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                            <img src={normalMarker} style={markerStyle} />
                        </a>
                        <ul className="dropdown-menu pull-right">
                            <li>
                                <a href="javascript:;">
                                    <span style={{ color: "#3498db" }}><i className="fa fa-info"></i> Trạm số 01 </span></a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <span style={{ color: "#1abc9c" }}> <i className="fa fa-location-arrow"></i> Số 20 đường xyz </span></a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <span style={{ color: "#7f8c8d" }}> <i className="fa fa-phone-square"></i> 043.123.456 </span> </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }

        function FireMarker(props) {
            return (

                <div className="dropdown">
                    <a href="javascript:;" data-toggle="dropdown" data-hover="dropdown" data-close-others="false">
                        <img src={fireMarker} style={markerStyle} />
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}><i className="fa fa-info"></i> Trạm số 01 </span></a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}> <i className="fa fa-location-arrow"></i> Số 20 đường xyz </span></a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}> <i className="fa fa-phone-square"></i> 043.123.456 </span> </a>
                        </li>
                    </ul>
                </div>

            )
        }

        if (isFire) {
            return FireMarker();
        } else {
            return NormalMarker();
        }
    }
}

export default Marker;