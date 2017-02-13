import React, { Component } from 'react';
import PageHead from '../PageHead';
import { Config } from '../../Config';
import io from 'socket.io-client';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Sound from 'react-sound';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import fireMarker from './fire.png';
import normalMarker from './normal-marker.png';
import offlineMarker from './offline-marker.png';
import { bounce } from 'react-animations';
import { StyleSheet, css } from 'aphrodite';
import { ToastContainer, ToastMessage, ReactToastr } from "react-toastr";
import _ from 'lodash';
import './indexMap.css';

/* global google */
const TOAST_ERROR = 1;
const TOAST_INFO = 2;
const TOAST_SUCCESS = 3;
const TOAST_WARNING = 4;

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let socket = io(Config.SocketUrl);

//SearchBox style
const INPUT_STYLE = {
    boxSizing: 'border-box',
    MozBoxSizing: 'border-box',
    border: '1px solid transparent',
    width: '240px',
    height: '32px',
    marginTop: '6px',
    padding: '0 12px',
    borderRadius: '1px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    fontSize: '14px',
    outline: 'none',
    textOverflow: 'ellipses',
};

const listGroupItemStyle = {
    border: '0px'
}

//Render marker
const GettingStartedGoogleMap = withGoogleMap(props => (

    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={14}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
    >
        <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={props.onPlacesChanged}
            inputPlaceholder="Tìm kiếm"
            inputStyle={INPUT_STYLE}
        />
        {props.markerPlace.map((marker, index) => (
            <Marker
                key={index}
                position={marker.position}
            >
            </Marker>
        ))}
        {props.markers.map((marker, index) => (
            <Marker
                icon={{
                    url: marker.icon
                }}
                key={index}
                options={{ optimized: false }}
                animation={marker.animation}
                position={marker.position}
                onClick={() => props.onMarkerClick(marker)}
            >
                {marker.showInfo && (
                    <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
                        <ul className="list-group">
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-info"></i>{marker.name}
                            </li>
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-location-arrow"></i> {marker.address}
                            </li>
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-phone-square"></i>{marker.phone}
                            </li>
                        </ul>
                    </InfoWindow>
                )}
            </Marker>
        ))}
    </GoogleMap>
));
//Main map
class IndexMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bounds: null,
            showModal: false,
            modalContent: '',
            listDevices: [],
            markers: [],
            markerPlace: [],
            fireHistoryId: '',
            center: { lat: 21.028952, lng: 105.852394 },
        };
        this.close = this.close.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleMarkerClose = this.handleMarkerClose.bind(this);
        this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
        this.handleChanged = this.handleChanged.bind(this);
        this.showToast = this.showToast.bind(this);
    }

    componentDidMount() {
        var self = this;

        socket.on('DeviceFireStateChanged', function (data) {
            if (data.isFire) {
                self.setState({
                    showModal: true,
                    txtTxtFireNote: '',
                    modalContent: 'Cảnh báo cháy tại: ' + data.doc.name + ' - ' + data.doc.address + ' - ' + data.doc.phone,
                    fireHistoryId: data.fireHistoryId
                });
                self.showToast(TOAST_ERROR, 'Cảnh báo cháy', data.doc.name);
            } else {
                self.showToast(TOAST_INFO, 'Cảnh báo cháy', 'Tại: ' + data.doc.name + ' Đã tắt');
            }

            self.setState({
                markers: self.state.markers.map(marker => {
                    if (_.isEqual(marker.markerId, data.MarkerId)) {

                        return {
                            ...marker,
                            icon: data.isFire ? fireMarker : normalMarker,
                            animation: data.isFire ? 1 : 4
                        };
                    }
                    return marker;
                }),
            });
        });

        socket.on('DeviceConnected', function (data) {
            self.setState({
                markers: self.state.markers.map(marker => {
                    if (_.isEqual(marker.markerId, data)) {
                        self.showToast(TOAST_INFO, marker.name, 'Đã kết nối!');
                        return {
                            ...marker,
                            icon: normalMarker,
                            animation: 4
                        };
                    }
                    return marker;
                }),
            });


        });

        socket.on('DeviceDisconnected', function (data) {
            self.setState({
                markers: self.state.markers.map(marker => {
                    if (_.isEqual(marker.markerId, data)) {
                        self.showToast(TOAST_WARNING, marker.name, 'Đã bị ngắt kết nối!');

                        return {
                            ...marker,
                            icon: offlineMarker,
                            animation: 4
                        };
                    }
                    return marker;
                }),
            });
        });

        axios.get(Config.ServiceUrl + '/ListDevices', {})
            .then(function (response) {
                self.setState({ listDevices: response.data });

                var tempMarkers = [];

                response.data.map(function (device) {
                    var markerIcon = offlineMarker;
                    if (device.isOnline) {
                        if (device.isFire) {
                            markerIcon = fireMarker;
                        } else {
                            markerIcon = normalMarker;
                        }
                    }
                    tempMarkers.push({
                        markerId: device.markerId,
                        position: new google.maps.LatLng(device.lat, device.long),
                        name: device.name,
                        address: device.address,
                        phone: device.phone,
                        icon: markerIcon,
                        animation: device.isFire ? 1 : 4,
                        showInfo: false
                    });
                });
                self.setState({ markers: tempMarkers });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChanged(e) {
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    handleMarkerClick(targetMarker) {
        this.setState({
            markers: this.state.markers.map(marker => {
                if (marker === targetMarker) {
                    return {
                        ...marker,
                        showInfo: true,
                    };
                }
                return marker;
            }),
        });
    }

    handleMarkerClose(targetMarker) {
        this.setState({
            markers: this.state.markers.map(marker => {
                if (marker === targetMarker) {
                    return {
                        ...marker,
                        showInfo: false,
                    };
                }
                return marker;
            }),
        });
    }

    handleMapMounted(map) {
        this._map = map;
    }
    handleBoundsChanged() {
        //When map moved
    }
    handleSearchBoxMounted(searchBox) {
        this._searchBox = searchBox;
    }

    handlePlacesChanged() {
        const places = this._searchBox.getPlaces();

        // Add a marker for each place returned from search bar
        const markerPlaces = places.map(place => ({
            position: place.geometry.location
        }));

        // Set markers; set map center to first search result
        var firstPlaceLat = places[0].geometry.location.lat();
        var firstPlaceLong = places[0].geometry.location.lng();
        this.setState({
            center: { lat: firstPlaceLat, lng: firstPlaceLong },
            markerPlace: markerPlaces
        });
    }

    //Close the alert dialog
    close() {
        var obj = Object();
        obj.table = 'firehistories';
        obj.value = this.state.fireHistoryId
        obj.cellName = 'note';
        obj.cellValue = this.state.txtTxtFireNote;

        var token = localStorage.getItem('token');
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            headers: { 'x-access-token': token }
        });
        instance.post('/Common/UpdateDataById', obj).then(function (response) {
        });
        this.setState({ showModal: false });
    }

    showToast(type, title, content) {
        const TIME_OUT = 1500;

        switch (type) {
            case TOAST_ERROR:
                this.refs.container.error(
                    content,
                    title, {
                        timeOut: TIME_OUT
                    });
                break;
            case TOAST_INFO:
                this.refs.container.info(
                    content,
                    title, {
                        timeOut: TIME_OUT
                    });
                break;
            case TOAST_SUCCESS:
                this.refs.container.success(
                    content,
                    title, {
                        timeOut: TIME_OUT
                    });
                break;
            case TOAST_WARNING:
                this.refs.container.warning(
                    content,
                    title, {
                        timeOut: TIME_OUT
                    });
                break;
            default:
                this.refs.container.info(
                    content,
                    title, {
                        timeOut: TIME_OUT
                    });
                break;
        }

    }

    // toastr() {
    //     this.refs.container.success('hi! Now is ', 'title', {
    //         closeButton: true,
    //     });
    //     // this.refs.container.success(
    //     //     "Welcome welcome welcome!!",
    //     //     "You are now home my friend. Welcome home my friend.", {
    //     //         timeOut: 30000,
    //     //         extendedTimeOut: 10000
    //     //     });
    //     // window.open("http://youtu.be/3SR75k7Oggg");
    // }
    render() {
        var styleContainer = {
            position: 'relative',
            margin: 0,
            padding: 0,
            flex: 1,
            height: '100%'
        };
        var styleMap = {
            position: 'relative',
            margin: 0,
            padding: 0,
            flex: 1,
            height: '800px'
        };
        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cảnh báo cháy</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Sound url="assets/ding.wav" playStatus="PLAYING" />
                        <p>{this.state.modalContent}</p>
                        <div>
                            <label htmlFor="txtTxtFireNote">Ghi chú</label>
                            <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtFireNote" name="txtTxtFireNote" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer
                    toastMessageFactory={ToastMessageFactory}
                    ref="container"
                    className="toast-top-right">
                    <Sound url="assets/you-have-new-message.mp3" playStatus="PLAYING" />
                </ToastContainer>

                <div className="page-content" style={{ padding: "0px" }}>
                    <div className="container-fluid" style={{ padding: "0px" }}>

                        {/*<!-- BEGIN PAGE CONTENT INNER -->*/}
                        <GettingStartedGoogleMap
                            center={this.state.center}
                            containerElement={
                                <div style={styleContainer} />
                            }
                            mapElement={
                                <div style={styleMap} />
                            }
                            markers={
                                this.state.markers
                            }
                            markerPlace={
                                this.state.markerPlace
                            }
                            onMapMounted={this.handleMapMounted}
                            onBoundsChanged={this.handleBoundsChanged}
                            bounds={this.state.bounds}
                            onSearchBoxMounted={this.handleSearchBoxMounted}
                            onPlacesChanged={this.handlePlacesChanged}
                            onMarkerClick={this.handleMarkerClick}
                            onMarkerClose={this.handleMarkerClose}
                        />

                    </div>
                </div>

            </div>
        );
    }

}

export default IndexMap;