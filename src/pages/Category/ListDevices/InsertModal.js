import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Config } from '../../../Config';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import './InsertModalStyle.css';
import './AutoSuggestStyle.css';
import axios from 'axios';
import _ from 'lodash';
import TableSMS from './TableSMS';
import ListDevicesStores from './ListDevicesStores';
import { observer } from 'mobx-react';
import mobx from 'mobx';
import Autosuggest from 'react-autosuggest';

/* global google */

//Set lai theme cho auto suggest bang cach dat ten class + listDeviceInsertModal de tranh viec bi trung className
const themeAutoSuggest = {
    container: 'container_listDeviceInsertModal',
    containerOpen: 'container--open_listDeviceInsertModal',
    input: 'input_listDeviceInsertModal',
    inputOpen: 'input--open_listDeviceInsertModal',
    inputFocused: 'input--focused_listDeviceInsertModal',
    suggestionsContainer: 'suggestions-container_listDeviceInsertModal',
    suggestionsContainerOpen: 'suggestions-container--open_listDeviceInsertModal',
    suggestionsList: 'suggestions-list_listDeviceInsertModal',
    suggestion: 'suggestion_listDeviceInsertModal',
    suggestionFirst: 'suggestion--first_listDeviceInsertModal',
    suggestionHighlighted: 'suggestion--highlighted_listDeviceInsertModal',
    sectionContainer: 'section-container_listDeviceInsertModal',
    sectionContainerFirst: 'section-container--first_listDeviceInsertModal',
    sectionTitle: 'section-title_listDeviceInsertModal'
};

// Imagine you have a list of languages that you'd like to autosuggest.
var autoCorrectAreas = [


];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    console.log(autoCorrectAreas);
    return inputLength === 0 ? autoCorrectAreas : autoCorrectAreas.filter(autoCorrectArea =>
        autoCorrectArea.name.toLowerCase().slice(0, inputLength) === inputValue
        ||
        autoCorrectArea.shortName.toLowerCase().slice(0, inputLength) === inputValue //Tim theo sdt
    );
};

// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
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

var listDevicesStores;

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
            bounds: null,
            markerPlace: [],
            center: { lat: 21.028952, lng: 105.852394 },
            selectedLat: 0,
            selectedLong: 0,
            modalDeviceIdError: false,
            modalDeviceIdIcon: 'fa fa-pencil',
            modalIsError: false,
            modalIsErrorText: '',
            imeis: [],
            areas: [],
            value: '', //value for suggestion
            suggestions: [],
            txtDeviceId: false,
            txtLatitude: false,
            txtLongitude: false,
            txtName: false,
            txtDeviceIdValid: false,
            txtLatitudeValid: false,
            txtLongitudeValid: false,
            txtNameValid: false,
            selectArea: '',
            tempDeviceId: ''
        };
        listDevicesStores = new ListDevicesStores();
        this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.onSave = this.onSave.bind(this);
        this.handleChanged = this.handleChanged.bind(this);
        this.onModalBtnCloseClicked = this.onModalBtnCloseClicked.bind(this);
        this.loadUnusedImeiCombobox = this.loadUnusedImeiCombobox.bind(this);
        this.loadAreas = this.loadAreas.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    }

    //Suggestion changed
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
        //Move map to location after choosed
        this.setState({
            center: { lat: _.toNumber(suggestion.latitude), lng: _.toNumber(suggestion.longitude) }
        });
        var self = this;
        this.setState({
            selectArea: suggestion.id,
            selectAreaName: suggestion.name
        }, () => {
            self.getId();
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onModalBtnCloseClicked(event) {
        this.props.onHide();
    }

    onSave(event) {
        //Danh sach gui tin sms
        if (this.state.txtDeviceIdValid && this.state.txtLatitudeValid && this.state.txtLongitudeValid && this.state.txtNameValid) {
            var sms = mobx.toJS(listDevicesStores.sms);

            var self = this;
            var postJson = {
                markerId: this.state.txtDeviceId,
                name: this.state.txtName,
                address: this.state.txtAddress,
                phone: this.state.txtPhone,
                lat: this.state.selectedLat,
                long: this.state.selectedLong,
                imei: this.state.selectPhone,
                desc: this.state.txtDesc,
                area: this.state.selectArea,
                areaName: this.state.selectAreaName,
                sms: sms
            };


            var instance = axios.create({
                baseURL: Config.ServiceUrl,
                timeout: Config.RequestTimeOut,
                headers: { 'x-access-token': localStorage.getItem('token') }
            });

            instance.post('/Common/InsertDeviceLocation', postJson)
                .then(function (response) {
                    if (response.data.ResponseCode === 1) {
                        self.setState({ modalIsError: false, selectedLat: 0, selectedLong: 0 });
                        self.loadUnusedImeiCombobox();
                        self.props.onHide();
                        self.props.loadDataParent();
                        listDevicesStores.reset();
                    } else {
                        self.setState({ modalIsError: true, modalIsErrorText: 'Lỗi không thể thêm mới dữ liệu' });
                    }

                })
                .catch(function (error) {
                    self.setState({ modalIsError: true, modalIsErrorText: error });
                });
        } else {
            alert('Bạn chưa nhập đủ hết các trường, kiểm tra lại!');
        }

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
        this.setState(state, () => {
            //Validate
            // if (this.state.txtDeviceId.length === 0) {
            //     this.setState({ txtDeviceIdValid: false });
            // } else {
            //     this.setState({ txtDeviceIdValid: true });
            // }
            if (this.state.txtName.length === 0) {
                this.setState({ txtNameValid: false });
            } else {
                this.setState({ txtNameValid: true });
            }
            if (this.state.txtLatitude.length === 0 || _.isEqual(this.state.txtLatitude, '0')) {
                this.setState({ txtLatitudeValid: false });
            } else {
                this.setState({ txtLatitudeValid: true });
            }
            if (this.state.txtLongitude.length === 0 || _.isEqual(this.state.txtLongitude, '0')) {
                this.setState({ txtLongitudeValid: false });
            } else {
                this.setState({ txtLongitudeValid: true });
            }
        });

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

    componentWillMount() {
        this.loadUnusedImeiCombobox();
        this.loadAreas();
        this.getId();//get temporary ID 
    }


    getId() {
        var self = this;
        var token = localStorage.getItem('token');
        var json = {}
        json.prefix = this.state.selectArea;
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.post('/DeviceRoute/GetDeviceId', json).then(function (response) {
            console.log(response.data);
            self.setState({ tempDeviceId: response.data.id });
        });
    }

    loadUnusedImeiCombobox() {
        var self = this;
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
        instance.get('FireHistory/GetListUnusedImei').then(function (response) {
            var imeis = response.data.data;
            if (_.size(imeis) > 0) {
                self.setState({ imeis: imeis });
                self.setState({ selectPhone: imeis[0].imei });

            } else {
                self.setState({ selectPhone: '', imeis: [] });
            }
        });
    }

    loadAreas() {
        var self = this;
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
        instance.get('/Area/ListAreasNoParent').then(function (response) {

            var areas = response.data.data;

            if (_.size(areas) > 0) {
                self.setState({ areas: areas });
                autoCorrectAreas = areas;
                self.setState({ selectArea: areas[0].id });
            } else {
                self.setState({ selectArea: '', selectAreaName: '' });
            }
        });
    }

    render() {
        const { value, suggestions } = this.state;
        // Autosuggest will pass through all these props to the input element.
        const inputProps = {
            placeholder: 'Nhập tên khu vực',
            value,
            onChange: this.onChange
        };

        const style = {
            position: 'relative',
            margin: 0,
            padding: 0,
            flex: 1,
            height: '550px'
        };

        var options = this.state.imeis.map(function (opt, i) {
            return <option key={i} value={opt.imei}>{opt.manufacture}-{opt.deviceName}-{opt.imei}</option>;
        }, this);

        const inputValidClass = "form-group form-md-line-input form-md-floating-label";
        const inputNotValidClass = inputValidClass + " has-error";
        const idValidClass = "fa fa-check";
        const idNotValidClass = "fa fa-times";
        const { loadDataParent, ...rest } = this.props;
        return (

            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
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
                            <br />
                            <div className="form-group form-md-line-input">
                                <input type="text" disabled className="form-control" value={this.state.selectedLat} id="idLatitude" name="txtLatitude" />
                                <label htmlFor="idLatitude">Kinh độ ( Latitude )</label>
                            </div>
                            <div className="form-group form-md-line-input">
                                <input type="text" disabled className="form-control" value={this.state.selectedLong} id="idLongitude" name="txtLongitude" />
                                <label htmlFor="idLongitude">Vĩ độ ( Longitude )</label>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="portlet light">
                                <div className="portlet-title">
                                    <div className="caption">
                                        Nội dung
							        </div>
                                </div>
                                <div className="portlet-body">
                                    <div className="tabbable-line">
                                        <ul className="nav nav-tabs ">
                                            <li className="active">
                                                <a href="#tab_15_1" data-toggle="tab">
                                                    Thông tin</a>
                                            </li>
                                            <li>
                                                <a href="#tab_15_2" data-toggle="tab">
                                                    SMS Báo cháy</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content">
                                            <div className="tab-pane active" id="tab_15_1">
                                                {/*Start Tab 1*/}
                                                <div className={inputValidClass}>
                                                    <div className="input-group right-addon">
                                                        <input value={this.state.tempDeviceId} readOnly={true} type="text" className="form-control" id="idTxtDeviceId" name="txtDeviceId" />
                                                        <label htmlFor="idTxtDeviceId">Device Id: (tạm tính)</label>
                                                        <span className="input-group-addon">
                                                            <i className={this.state.txtDeviceIdValid ? idValidClass : idNotValidClass}></i>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={this.state.txtNameValid ? inputValidClass : inputNotValidClass}>
                                                    <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtName" name="txtName" />
                                                    <label htmlFor="idtxtName">Tên tủ báo cháy</label>
                                                </div>
                                                <div className="form-group form-md-line-input">
                                                    <label htmlFor="auto-suggest-area" style={{ color: '#999', 'fontSize': '16px' }}>Chọn khu vực</label>
                                                    <Autosuggest
                                                        theme={themeAutoSuggest}
                                                        suggestions={suggestions}
                                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                        onSuggestionSelected={this.onSuggestionSelected}
                                                        getSuggestionValue={getSuggestionValue}
                                                        renderSuggestion={renderSuggestion}
                                                        inputProps={inputProps}
                                                        alwaysRenderSuggestions={true}
                                                        id="auto-suggest-area"
                                                    />
                                                </div>

                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtAddress" name="txtAddress" />
                                                    <label htmlFor="idtxtAddress">Địa chỉ</label>
                                                </div>
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtPhone" name="txtPhone" />
                                                    <label htmlFor="idtxtPhone">Số điện thoại</label>
                                                </div>
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input onChange={this.handleChanged} type="text" className="form-control" id="idtxtDesc" name="txtDesc" />
                                                    <label htmlFor="idtxtDesc">Mô tả</label>
                                                </div>

                                                <div className="form-group form-md-line-input form-md">
                                                    <select onChange={this.handleChanged} className="form-control" id="idSelectPhone" name="selectPhone" >
                                                        {options}
                                                    </select>
                                                    <label htmlFor="idSelectPhone">Kết Nối điện thoại</label>
                                                </div>
                                                {/*End Tab 1*/}
                                            </div>
                                            {/* Tab 2 DS SO di dong nhan tin sms khi co bao chay*/}
                                            <div className="tab-pane" id="tab_15_2">
                                                <h4> Danh sách số di động nhận SMS khi có báo cháy</h4>
                                                <TableSMS store={listDevicesStores} />
                                            </div>
                                            {/*END DS SO di dong nhan tin sms*/}
                                        </div>
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

export default observer(InsertModal);