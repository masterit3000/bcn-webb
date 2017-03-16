import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { Config } from '../../../Config';
import _ from 'lodash';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";

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

class InsertModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            txtId: '',
            txtName: '',
            txtShortName: '',
            txtIdValid: true,
            txtNameValid: true,
            txtShortNameValid: true,
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

    onSave(event) {

        if (this.props.isNewParent) {
            if (this.state.txtNameValid && this.state.txtName.length > 0 && this.state.txtLatitudeValid && this.state.txtLongtitudeValid && this.state.txtShortNameValid && this.state.txtShortName.length > 0) {
                //Them moi node cha
                var self = this;
                var token = localStorage.getItem('token');
                var params = new URLSearchParams();
                params.append('id', this.state.txtId);
                params.append('name', this.state.txtName);
                params.append('shortName', this.state.txtShortName);
                params.append('latitude', this.state.selectedLat);
                params.append('longtitude', this.state.selectedLong);

                var instance = axios.create({
                    baseURL: Config.ServiceUrl,
                    timeout: Config.RequestTimeOut,
                    auth: {
                        username: Config.basicAuthUsername,
                        password: Config.basicAuthPassword
                    },
                    headers: { 'x-access-token': token }
                });
                instance.post('/Area/InsertParentArea', params).then(function (response) {
                    self.setState({ datas: response.data.data });
                    self.props.onHide();
                    self.setState({
                        center: { lat: 21.028952, lng: 105.852394 },
                        selectedLat: 0,
                        selectedLong: 0,
                        txtLatitudeValid: false,
                        txtLongtitudeValid: false
                    });
                });

            }
        }
        else {
            //Them moi node con
            if (this.state.txtNameValid && this.state.txtName.length > 0 && this.state.txtLatitudeValid && this.state.txtLongtitudeValid && this.state.txtShortNameValid && this.state.txtShortName.length > 0) {
                
                var self2 = this;
                var token2 = localStorage.getItem('token');
                var params2 = new URLSearchParams();
                params2.append('parent', this.props.parentId);
                params2.append('name', this.state.txtName);
                params2.append('shortName', this.state.txtShortName);
                params2.append('latitude', this.state.selectedLat);
                params2.append('longtitude', this.state.selectedLong);

                var instance2 = axios.create({
                    baseURL: Config.ServiceUrl,
                    timeout: Config.RequestTimeOut,
                    auth: {
                        username: Config.basicAuthUsername,
                        password: Config.basicAuthPassword
                    },
                    headers: { 'x-access-token': token2 }
                });
                instance2.post('/Area/InsertChildArea', params2).then(function (response) {
                    self2.setState({ datas: response.data.data });
                    self2.props.onHide();
                    self2.setState({
                        center: { lat: 21.028952, lng: 105.852394 },
                        selectedLat: 0,
                        selectedLong: 0,
                        txtLatitudeValid: false,
                        txtLongtitudeValid: false
                    })
                });
            }
        }
    }

    handleChanged(e) {
        e.persist();
        var state = {};

        state[e.target.name] = e.target.value;
        this.setState(state, (a) => {
            var self = this;

            // if (e.target.name === 'txtId') {
            //     if (e.target.value.length === 0) {
            //         self.setState({ txtIdValid: false });
            //     }
            //     else {
            //         //Check trung txtId
            //         var token = localStorage.getItem('token');
            //         var params = new URLSearchParams();
            //         params.append('id', e.target.value);
            //         var instance = axios.create({
            //             baseURL: Config.ServiceUrl,
            //             timeout: Config.RequestTimeOut,
            //             auth: {
            //                 username: Config.basicAuthUsername,
            //                 password: Config.basicAuthPassword
            //             },
            //             headers: { 'x-access-token': token }
            //         });
            //         instance.post('/Area/CheckExistId', params).then(function (response) {
            //             if (response.data.found === 1) {
            //                 self.setState({ txtIdValid: false });
            //             } else {
            //                 self.setState({ txtIdValid: true });
            //             }

            //         });

            //     }
            // }
            if (this.state.txtName.length === 0) {
                this.setState({ txtNameValid: false });
            } else {
                this.setState({ txtNameValid: true });

            }
            if (this.state.txtShortName.length === 0) {
                this.setState({ txtShortNameValid: false });
            } else {
                this.setState({ txtShortNameValid: true });

            }
        });
    }

    render() {
        const style = {
            position: 'relative',
            margin: 0,
            padding: 0,
            flex: 1,
            height: '550px'
        };
        const inputValidClass = "form-group form-md-line-input form-md-floating-label";
        const inputNotValidClass = inputValidClass + " has-error";
        const latlongValidClass = "form-group form-md-line-input";
        const latlongNotValidClass = latlongValidClass + " has-error";
        const { isNewParent, parentId, ...rest } = this.props;

        return (
            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="row">
                        <div className="col-md-6">
                            <GettingStartedGoogleMap
                                center={this.state.center}
                                containerElement={
                                    <div style={style} />
                                }
                                mapElement={
                                    <div style={style} />
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
                            <div className={inputValidClass} >
                                <input onChange={this.handleChanged} type="text" readOnly='true' className="form-control" id="idTxtParent" name="txtParent" value={isNewParent ? "Nhánh chính" : parentId} />
                                <label htmlFor="idTxtParent">Khu vực cha</label>

                            </div>
                            {/*<div className={this.state.txtIdValid ? inputValidClass : inputNotValidClass}>
                                <div className="input-group right-addon">
                                    <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtId" name="txtId" />
                                    <label htmlFor="idTxtId">ID Khu vực</label>
                                    <span className="input-group-addon">
                                        <i className={this.state.txtIdValid ? "fa fa-check font-blue" : "fa fa-ban font-red"}></i>
                                    </span>
                                </div>
                            </div>*/}

                            <div className={this.state.txtNameValid ? inputValidClass : inputNotValidClass}>
                                <div className="input-group right-addon">
                                    <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtName" name="txtName" />
                                    <label htmlFor="idTxtName">Tên Khu vực</label> <span className="input-group-addon">
                                        <i className={this.state.txtNameValid ? "fa fa-check font-blue" : "fa fa-ban font-red"}></i>
                                    </span>
                                </div>
                            </div>

                            <div className={this.state.txtShortNameValid ? inputValidClass : inputNotValidClass}>
                                <div className="input-group right-addon">
                                    <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtShortName" name="txtShortName" />
                                    <label htmlFor="idTxtShortName">Tên viết tắt</label> <span className="input-group-addon">
                                        <i className={this.state.txtShortNameValid ? "fa fa-check font-blue" : "fa fa-ban font-red"}></i>
                                    </span>
                                </div>
                            </div>

                            <div className={this.state.txtLatitudeValid ? latlongValidClass : latlongNotValidClass}>
                                <input type="text" disabled className="form-control" value={this.state.selectedLat} id="idLatitude" name="txtLatitude" />
                                <label htmlFor="idLatitude">Kinh độ ( Latitude )</label>
                            </div>
                            <div className={this.state.txtLongtitudeValid ? latlongValidClass : latlongNotValidClass}>
                                <input type="text" disabled className="form-control" value={this.state.selectedLong} id="idLongtitude" name="txtLongtitude" />
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

export default InsertModal;