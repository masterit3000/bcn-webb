import React, { Component } from 'react';
// import PageHead from '../PageHead';
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
import { ToastContainer, ToastMessage } from "react-toastr";
import _ from 'lodash';
import './indexMap.css';
import DeviceLogModal from './DeviceLogModal';
import MarkerDetailInfoModal from './MarkerDetailInfoModal';
import Autosuggest from 'react-autosuggest';
import MapStores from './MapStores';
var mapStores;

/* global google */
const TOAST_ERROR = 1;
const TOAST_INFO = 2;
const TOAST_SUCCESS = 3;
const TOAST_WARNING = 4;

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let socket = io(Config.SocketUrl);

var listDevicesAutoCorrects = [];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : listDevicesAutoCorrects.filter(item =>
        item.name.toLowerCase().slice(0, inputLength) === inputValue //Tim theo ten
        ||
        item.phone.toLowerCase().slice(0, inputLength) === inputValue //Tim theo sdt
        ||
        item.markerId.toLowerCase().slice(0, inputLength) === inputValue //Tim theo markerId
        ||
        item.address.toLowerCase().slice(0, inputLength) === inputValue //Tim theo dia chi
    );
};

// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.markerId + " - " + suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        {suggestion.markerId} - {suggestion.name}
        <div className="suggestionSub">
            {suggestion.phone} - {suggestion.address}
        </div>
    </div>
);

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
            inputPlaceholder="Tìm kiếm địa điểm"
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
                onMouseOut={() => props.onMarkerMouseOut(marker)}
                onMouseOver={() => props.onMarkerMouseOver(marker)}
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
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-bolt" aria-hidden="true"></i>
                                {marker.powerCordState}
                            </li>
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-headphones" aria-hidden="true"></i>
                                {marker.headSetState}
                            </li>
                            <li>
                                {/*<button onClick={props.onBtnViewLogClick} data-markerId={marker.markerId} className="btn btn-success btn-view-log">Xem log</button>
                                <button onClick={props.onBtnInfoClick} data-markerId={marker.markerId} className="btn btn-info btn-view-log">Chi tiết</button>*/}
                            </li>
                        </ul>
                    </InfoWindow>
                )}
            </Marker>
        ))}
    </GoogleMap >
));
//Main map
class IndexMap extends Component {

    constructor(props) {
        super(props);
        mapStores = new MapStores();
        this.state = {
            bounds: null,
            showModal: false,
            showLogModal: false,
            showMarkerDetailLogModal: false,
            modalContent: '',
            listDevices: [],
            markers: [],
            markerPlace: [],
            deviceLog: [],
            fireHistoryId: '',
            center: { lat: 21.028952, lng: 105.852394 },
            value: '', //for suggestion
            suggestions: [],
            markerDetailInfoModalData: {}
        };
        this.close = this.close.bind(this);
        this.closeLogModal = this.closeLogModal.bind(this);
        this.closeMarkerDetailLogModal = this.closeMarkerDetailLogModal.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleMarkerClose = this.handleMarkerClose.bind(this);
        this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
        this.handleChanged = this.handleChanged.bind(this);
        this.showToast = this.showToast.bind(this);
        this.logConnected = this.logConnected.bind(this);
        this.logDisconnected = this.logDisconnected.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.handleMarkerOnMouseOut = this.handleMarkerOnMouseOut.bind(this);
        this.handleMarkerOnMouseOver = this.handleMarkerOnMouseOver.bind(this);
    }

    //Suggestion
    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
        this.setState({ center: { lat: suggestion.lat, lng: suggestion.long } });
    }

    //Suggestion on change
    onChange = (event, { newValue }) => {
        var self = this;
        this.setState({
            value: newValue
        }, () => {

        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    logDisconnected(markerId) {
        //save log
        var self = this;
        var token = localStorage.getItem('token');
        var json = {}
        json.markerId = markerId;
        json.logType = "Trạng thái";
        json.logDesc = "Đã bị ngắt kết nối (Disconnected)";
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.post('/DeviceRoute/InsertDeviceLogFromWeb', json).then(function (response) {
            self.setState({ datas: response.data.data });
        });
        //end save log
    }

    logConnected(markerId) {
        //save log
        var self = this;
        var token = localStorage.getItem('token');
        var json = {}
        json.markerId = markerId;
        json.logType = "Trạng thái";
        json.logDesc = "Đã kết nối (Connected)";
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.post('/DeviceRoute/InsertDeviceLogFromWeb', json).then(function (response) {
            self.setState({ datas: response.data.data });
        });
        //end save log
    }

    componentDidMount() {
        var self = this;

        socket.on('DeviceFireStateChanged', function (data) {

            var arrListDevices = self.state.listDevices;

            _.forEach(arrListDevices, function (value) {
                if (_.isEqual(value.MarkerId, arrListDevices.MarkerId)) {
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

                    return false;
                }
            });


        });

        socket.on('DeviceConnected', function (data) {
            self.setState({
                markers: self.state.markers.map(marker => {
                    if (_.isEqual(marker.markerId, data)) {
                        self.showToast(TOAST_INFO, marker.name, 'Đã kết nối!');
                        self.logConnected(marker.markerId);

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
                        self.logDisconnected(marker.markerId);
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

        var token = localStorage.getItem('token');
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.get('/MainMap/ListDevices').then(function (response) {
            //vi tri dau tien ma user theo doi ma he thong tim duoc
            var firstLoadLat = _.toNumber(response.data.lat);
            var firstLoadLong = _.toNumber(response.data.long);
            if (!firstLoadLat || !firstLoadLong) {
                //Neu khong tim thay vi tri theo doi mac dinh chon marker dau tien
                firstLoadLat = response.data.data[0].lat;
                firstLoadLong = response.data.data[0].long;
            }


            self.setState({ listDevices: response.data.data, center: { lat: firstLoadLat, lng: firstLoadLong } });

            listDevicesAutoCorrects = response.data.data;

            var tempMarkers = [];
            _.forEach(response.data.data, function (device) {
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
                    showInfo: false,
                    powerCordState: device.powerCordState ? "Đang cắm sạc" : "Chưa cắm sạc",
                    headSetState: device.headSetState ? "Dây tai nghe đang cắm" : "Chưa cắm dây tai nghe"
                });
            });

            self.setState({ markers: tempMarkers });
        });
    }

    handleChanged(e) {
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    handleMarkerClick(targetMarker) {
        this.setState({ deviceLog: [] });
        var self = this;
        var token = localStorage.getItem('token');
        var json = {}
        json.markerId = targetMarker.markerId;
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.post('/DeviceRoute/GetMarkerById', json).then(function (response) {
            self.setState({ markerDetailInfoModalData: response.data.data, showMarkerDetailLogModal: true });
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

    handleMarkerOnMouseOut(targetMarker) {
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

    handleMarkerOnMouseOver(targetMarker) {
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



    //close the log modal
    closeLogModal() {
        this.setState({ showLogModal: false });
    }

    //Close the marker detail modal
    closeMarkerDetailLogModal() {
        this.setState({ showMarkerDetailLogModal: false });
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

        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input element.
        const inputProps = {
            placeholder: 'Tìm kiếm địa điểm tủ báo cháy',
            value,
            onChange: this.onChange
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

                {/*<DeviceLogModal logs={this.state.deviceLog} show={this.state.showLogModal} onHide={this.closeLogModal} />*/}
                <MarkerDetailInfoModal show={this.state.showMarkerDetailLogModal} data={this.state.markerDetailInfoModalData} onHide={this.closeMarkerDetailLogModal} />

                <div className="page-content" style={{ padding: "0px" }}>
                    <div className="container-fluid" style={{ padding: "0px" }}>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            onSuggestionSelected={this.onSuggestionSelected}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                        />

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
                            onMarkerMouseOut={this.handleMarkerOnMouseOut}
                            onMarkerMouseOver={this.handleMarkerOnMouseOver}
                        />

                    </div>
                </div>

            </div>
        );
    }

}

export default IndexMap;