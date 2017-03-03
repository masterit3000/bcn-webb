import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { Config } from '../../../Config';
import _ from 'lodash';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import { observer } from 'mobx-react';
import mobx from 'mobx';

/* global google */
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

//Render marker
const GettingStartedGoogleMap = withGoogleMap(props => (

    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={14}
        center={props.center}
        onClick={props.onMapClick}
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

        <Marker
            key={props.markerPlace.key}
            position={props.markerPlace.position}
        >
        </Marker>

    </GoogleMap>
));
class UpdateModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            txtName: '',
            txtNameValid: true,
            bounds: null,
            markerPlace: [],
            center: { lat: 21.028952, lng: 105.852394 },
            selectedLat: 0,
            selectedLong: 0,
            txtLatitudeValid: false,
            txtLongtitudeValid: false,
        };

        this.handleChanged = this.handleChanged.bind(this);
        this.onSave = this.onSave.bind(this);

        //Map
        this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);

    };

    //Map event
    handlePlacesChanged() {
        const places = this._searchBox.getPlaces();
        var firstPlaceLat = places[0].geometry.location.lat();
        var firstPlaceLong = places[0].geometry.location.lng();
        this.setState({
            center: { lat: firstPlaceLat, lng: firstPlaceLong }
        });
    }
    handleSearchBoxMounted(searchBox) {
        this._searchBox = searchBox;
    }
    handleMapMounted(map) {
        this._map = map;
    }
    handleBoundsChanged() {

    }
    handleMapClick(event) {
        this.setState({
            markerPlace: {
                position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
                key: Date.now,
                defaultAnimation: 2,
            },
            selectedLat: event.latLng.lat(),
            selectedLong: event.latLng.lng(),
            txtLatitudeValid: true,
            txtLongtitudeValid: true
        });
        this.props.stores.doUpdateLat(event.latLng.lat());
        this.props.stores.doUpdateLong(event.latLng.lng());

    }
    //End map event

    onSave(event) {
        var self = this;
        var token = localStorage.getItem('token');
        var params = new URLSearchParams();
        params.append('id', this.props.updateId);
        params.append('name', this.props.stores.updateName);
        params.append('lat', this.props.stores.updateLatitude);
        params.append('long', this.props.stores.updateLongitude);

        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.post('/Area/UpdateArea', params).then(function (response) {
            self.props.onHide();
        });
    }

    handleChanged(e) {
        e.persist();
        if (_.isEqual(e.target.name, 'txtName')) {
            this.props.stores.doUpdateName(e.target.value);
        } else if (_.isEqual(e.target.name, 'txtLatitude')) {
            this.props.stores.doUpdateLat(e.target.value);
        } else if (_.isEqual(e.target.name, 'txtLongtitude')) {
            this.props.stores.doUpdateLong(e.target.value);
        }

    }

    render() {
        const style = {
            position: 'relative',
            margin: 0,
            padding: 0,
            flex: 1,
            height: '550px'
        };
        const inputValidClass = "form-group form-md-line-input";
        const inputNotValidClass = inputValidClass + " has-error";
        const latlongValidClass = "form-group form-md-line-input";
        const latlongNotValidClass = latlongValidClass + " has-error";
        const { stores, updateId, updateName, updateLongitude, updateLatitude, ...rest } = this.props;

        var lastLatitude = Number(mobx.toJS(stores.updateLatitude));
        var lastLongitude = Number(mobx.toJS(stores.updateLongitude));
     
        var lastMarkerPlace = {
            position: { lat: lastLatitude, lng: lastLongitude },
            key: Date.now,
            defaultAnimation: 2
        };
        var lastCenter = {
            lat: lastLatitude, lng: lastLongitude
        }
        return (
            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <GettingStartedGoogleMap
                                center={lastCenter}
                                containerElement={
                                    <div style={style} />
                                }
                                mapElement={
                                    <div style={style} />
                                }
                                markerPlace={
                                    lastMarkerPlace
                                }
                                onMapMounted={this.handleMapMounted}
                                onBoundsChanged={this.handleBoundsChanged}
                                bounds={this.state.bounds}
                                onSearchBoxMounted={this.handleSearchBoxMounted}
                                onPlacesChanged={this.handlePlacesChanged}
                                onMapClick={this.handleMapClick}
                            />
                        </div>
                        <div className="col-md-6">

                            <div className={this.state.txtIdValid ? inputValidClass : inputNotValidClass}>
                                <div className="input-group right-addon">
                                    <input onChange={this.handleChanged} type="text" readOnly='true' className="form-control" id="idTxtId" name="txtId" value={updateId} />
                                    <label htmlFor="idTxtId">ID Khu vực</label>
                                    <span className="input-group-addon">
                                        <i className="fa fa-check font-blue"></i>
                                    </span>
                                </div>
                            </div>

                            <div className={this.state.txtNameValid ? inputValidClass : inputNotValidClass}>
                                <div className="input-group right-addon">
                                    <input onChange={this.handleChanged} defaultValue={updateName} type="text" className="form-control" id="idTxtName" name="txtName" />
                                    <label htmlFor="idTxtName">Tên Khu vực</label> <span className="input-group-addon">
                                        <i className={this.state.txtNameValid ? "fa fa-check font-blue" : "fa fa-ban font-red"}></i>
                                    </span>
                                </div>
                            </div>

                            <div className={this.state.txtLatitudeValid ? latlongValidClass : latlongNotValidClass}>
                                <input type="text" disabled className="form-control" value={stores.updateLatitude} id="idLatitude" name="txtLatitude" />
                                <label htmlFor="idLatitude">Kinh độ ( Latitude )</label>
                            </div>
                            <div className={this.state.txtLongtitudeValid ? latlongValidClass : latlongNotValidClass}>
                                <input type="text" disabled className="form-control" value={stores.updateLongitude} id="idLongtitude" name="txtLongtitude" />
                                <label htmlFor="idLongtitude">Vĩ độ ( Longtitude )</label>

                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.onSave} className="btn blue">Lưu lại</button>
                    <button onClick={this.props.onHide} className="btn red">Đóng</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default observer(UpdateModal);