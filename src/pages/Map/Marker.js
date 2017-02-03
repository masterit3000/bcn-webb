import React, { Component } from 'react';
import fireMarker from './fire.png';
import normalMarker from './normal-marker.png';
import offlineMarker from './offline-marker.png';
class Marker extends Component {

    render() {
        const isFire = this.props.isFire;
        const isOnline = this.props.isOnline;

        var markerStyle = {
            width: "25px",
            height: "auto"
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
                                    <span style={{ color: "#3498db" }}><i className="fa fa-info"></i> {props.name} </span></a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <span style={{ color: "#1abc9c" }}> <i className="fa fa-location-arrow"></i> {props.address} </span></a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <span style={{ color: "#7f8c8d" }}> <i className="fa fa-phone-square"></i> {props.phone} </span> </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }
        function OfflineMarker(props) {
            return (

                <div className="dropdown">
                    <a href="javascript:;" data-toggle="dropdown" data-hover="dropdown" data-close-others="false">
                        <img src={offlineMarker} style={markerStyle} />
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}><i className="fa fa-info"></i> {props.name} </span></a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}> <i className="fa fa-location-arrow"></i> {props.address} </span></a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}> <i className="fa fa-phone-square"></i>{props.phone}</span> </a>
                        </li>
                    </ul>
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
                                <span style={{ color: "#e74c3c" }}><i className="fa fa-info"></i> {props.name} </span></a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}> <i className="fa fa-location-arrow"></i> {props.address} </span></a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span style={{ color: "#e74c3c" }}> <i className="fa fa-phone-square"></i>{props.phone}</span> </a>
                        </li>
                    </ul>
                </div>
            )
        }
        if (isOnline) {
            if (isFire) {
                return FireMarker(this.props);
            } else {
                return NormalMarker(this.props);
            }
        } else {
            return OfflineMarker(this.props);
        }

    }
}

export default Marker;