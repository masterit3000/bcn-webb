import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Config } from '../../../Config';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import InsertModalCss from './InsertModalStyle.css';
import axios from 'axios';

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
    constructor() {
        super();
        this.state = {
            bounds: null,
            markerPlace: [],
            center: { lat: 21.028952, lng: 105.852394 },
            selectedLat: 0,
            selectedLong: 0,
            modalDeviceIdError: false,
            modalDeviceIdIcon: 'fa fa-pencil',
            modalIsError: false,
            modalIsErrorText: ''
        };
        this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.onSave = this.onSave.bind(this);
        this.handleChanged = this.handleChanged.bind(this);
        this.onModalBtnCloseClicked = this.onModalBtnCloseClicked.bind(this);
    }
    onModalBtnCloseClicked(event) {
        this.props.onHide();
    }
    onSave(event) {
        var self = this;
        var postJson = {
            markerId: this.state.txtDeviceId,
            name: this.state.txtName,
            address: this.state.txtAddress,
            phone: this.state.txtPhone,
            lat: this.state.selectedLat,
            long: this.state.selectedLong
        };

        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            headers: { 'x-access-token': localStorage.getItem('token') }
        });

        instance.post('/Common/InsertDeviceLocation', postJson)
            .then(function (response) {
                if (response.data.ResponseCode === 1) {
                    self.setState({ modalIsError: false });
                    self.props.onHide();
                    self.props.loadData();
                } else {
                    self.setState({ modalIsError: true, modalIsErrorText: 'Lỗi không thể thêm mới dữ liệu' });
                }

            })
            .catch(function (error) {
                self.setState({ modalIsError: true, modalIsErrorText: error });
            });
    }

    handleMapClick(event) {
        this.setState({
            markerPlace: {
                position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
                key: Date.now,
                defaultAnimation: 2,
            },
            selectedLat: event.latLng.lat(),
            selectedLong: event.latLng.lng()
        });
    }

    handleChanged(event) {
        var state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    handleMapMounted(map) {
        this._map = map;
    }
    handleBoundsChanged() {

    }
    handleSearchBoxMounted(searchBox) {
        this._searchBox = searchBox;
    }

    handlePlacesChanged() {
        const places = this._searchBox.getPlaces();
        var firstPlaceLat = places[0].geometry.location.lat();
        var firstPlaceLong = places[0].geometry.location.lng();
        this.setState({
            center: { lat: firstPlaceLat, lng: firstPlaceLong }
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
        return (
            <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg"><i className="fa fa-plus" aria-hidden="true"></i> Thêm mới tủ báo cháy</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="row">
                        {
                            this.state.modalIsError ? (
                                <div className="alert alert-warning" style={{ margin: "10px 10px 10px 10px" }}>
                                    <strong>Cảnh báo!</strong> {this.state.modalIsErrorText}
                                </div>
                            ) : null
                        }

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
                            <div className="portlet light">
                                <div className="portlet-title">
                                    <div className="caption">
                                        Nội dung
							        </div>
                                </div>
                                <div className="portlet-body">

                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="input-group right-addon">
                                            <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtDeviceId" name="txtDeviceId" />
                                            <label htmlFor="idTxtDeviceId">Device Id</label>
                                            <span className="input-group-addon">
                                                <i className="fa fa-check"></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtName" name="txtName" />
                                        <label htmlFor="idtxtName">Tên tủ báo cháy</label>
                                    </div>
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtAddress" name="txtAddress" />
                                        <label htmlFor="idtxtAddress">Địa chỉ</label>
                                    </div>
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtPhone" name="txtPhone" />
                                        <label htmlFor="idtxtPhone">Số điện thoại</label>
                                    </div>
                                    <div className="form-group form-md-line-input">
                                        <input type="text" disabled className="form-control" value={this.state.selectedLat} id="idLatitude" name="txtLatitude" />
                                        <label htmlFor="idLatitude">Kinh độ ( Latitude )</label>
                                    </div>
                                    <div className="form-group form-md-line-input">
                                        <input type="text" disabled className="form-control" value={this.state.selectedLong} id="idLongtitude" name="txtLongtitude" />
                                        <label htmlFor="idLongtitude">Vĩ độ ( Longtitude )</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSave} bsStyle="success"> <i className="fa fa-plus" aria-hidden="true"></i>Thêm mới</Button>
                    <Button onClick={this.onModalBtnCloseClicked} bsStyle="danger"><i className="fa fa-times" aria-hidden="true"></i>Đóng</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default InsertModal;