import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import axios from 'axios';
import { Config } from '../../../Config';
import mobx from 'mobx';

import _ from 'lodash';

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
const mapStyle = {
    position: 'relative',
    margin: 0,
    padding: 0,
    flex: 1,
    height: '550px'
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

class FireHydrantUpdateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bounds: null,
            markerPlace: [],
            center: { lat: 0, lng: 0 },
            selectedLat: 0,
            selectedLong: 0
        }

        this.handleChanged = this.handleChanged.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onClose = this.onClose.bind(this);
        //Map
        this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
    };

    componentWillReceiveProps(props) {
        var cloneUpdateData = mobx.toJS(props.stores.updateData);
        
        this.setState({
            center: { lat: _.toNumber(cloneUpdateData.lat), lng: _.toNumber(cloneUpdateData) },
            txtName: cloneUpdateData.name
        });
    }

    onSave(e) {
        if (
            this.state.txtName && this.state.txtName.length > 0 &&
            this.state.txtAddress && this.state.txtAddress.length > 0 &&
            this.state.selectedLat > 0 && this.state.selectedLong > 0
        ) {
            var self = this;
            var token = localStorage.getItem('token');
            var json = {}
            json.name = this.state.txtName;
            json.address = this.state.txtAddress;
            json.desc = this.state.txtDesc;
            json.lat = this.state.selectedLat;
            json.long = this.state.selectedLong;

            var instance = axios.create({
                baseURL: Config.ServiceUrl,
                timeout: Config.RequestTimeOut,
                auth: {
                    username: Config.basicAuthUsername,
                    password: Config.basicAuthPassword
                },
                headers: { 'x-access-token': token }
            });
            instance.post('/FireHydrant/InsertFireHydrant', json).then(function (response) {
                self.props.stores.isShowUpdateModal = false;
                // self.props.loadData();
            });
        } else {
            alert('Bạn chưa nhập hết các trường yêu cầu ( tên, địa chỉ, bản đồ )');
        }
    }

    onClose(e) {
        this.props.stores.isShowUpdateModal = false;
        // this.props.loadData();
    }

    handleChanged(e) {
        e.persist();
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    //Map
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
    }

    render() {
        const { stores, ...rest } = this.props;

        return (
            <Modal {...rest} onHide={this.onClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg"><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Chỉnh sửa nguồn nước {stores.updateData.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <GettingStartedGoogleMap
                                center={this.state.center}
                                containerElement={
                                    <div style={mapStyle} />
                                }
                                mapElement={
                                    <div style={mapStyle} />
                                }
                                markerPlace={
                                    this.state.markerPlace
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
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtName" name="txtName" />
                                <label htmlFor="idtxtName">Tên trụ nước</label>
                            </div>

                            <div className="form-group form-md-line-input form-md-floating-label">
                                <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtAddress" name="txtAddress" />
                                <label htmlFor="idtxtAddress">Địa chỉ</label>
                            </div>

                            <div className="form-group form-md-line-input form-md-floating-label">
                                <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtDesc" name="txtDesc" />
                                <label htmlFor="idtxtDesc">Mô tả</label>
                            </div>

                            <div className="form-group form-md-line-input">
                                <input type="text" disabled className="form-control" value={this.state.selectedLat} id="idLatitude" name="txtLatitude" />
                                <label htmlFor="idLatitude">Kinh độ ( Latitude )</label>
                            </div>
                            <div className="form-group form-md-line-input">
                                <input type="text" disabled className="form-control" value={this.state.selectedLong} id="idLongitude" name="txtLongitude" />
                                <label htmlFor="idLongitude">Vĩ độ ( Longtitude )</label>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSave} bsStyle="success"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Lưu lại</Button>
                    <Button onClick={this.onClose} bsStyle="danger"><i className="fa fa-times" aria-hidden="true"></i>Đóng</Button>
                </Modal.Footer>
            </Modal>

        );
    }
}

export default observer(FireHydrantUpdateModal);
