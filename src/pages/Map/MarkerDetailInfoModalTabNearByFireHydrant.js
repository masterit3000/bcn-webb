import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../Config';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { MAP } from 'react-google-maps/lib/constants';

import fireHydrantMarkerImg from './fire-hydrant.png';
import _ from 'lodash';
import { observer } from 'mobx-react';
import mobx from 'mobx';

/* global google */

const listGroupItemStyle = {
    border: '0px'
}

var styleContainer = {
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
    height: '350px'
};
//Render marker
const GettingStartedGoogleMap = withGoogleMap(props => (

    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={14}
        center={props.center}
        onClick={props.onMapClick}
    >
        <Marker
            key={props.markerPlace.key}
            position={props.markerPlace.position}
        >
        </Marker>
        {
            props.fireHydrantsMarkers.map((fireHydrantsMarker, index) => (

                <Marker
                    icon={{
                        url: fireHydrantMarkerImg
                    }}
                    key={index}
                    options={{ optimized: false }}
                    animation={4}
                    position={new google.maps.LatLng(fireHydrantsMarker.lat, fireHydrantsMarker.long)}
                    onMouseOut={() => props.onFireHydrantMarkerMouseOut(fireHydrantsMarker)}
                    onMouseOver={() => props.onFireHydrantMarkerMouseOver(fireHydrantsMarker)}
                > {fireHydrantsMarker.showInfo && (
                    <InfoWindow>
                        <ul className="list-group">
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-info"></i>{fireHydrantsMarker.name}
                            </li>
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-location-arrow"></i> {fireHydrantsMarker.address}
                            </li>
                            <li className="list-group-item" style={listGroupItemStyle}>
                                <i className="fa fa-file-text"></i>{fireHydrantsMarker.desc}
                            </li>
                        </ul>
                    </InfoWindow>
                )}
                </Marker>
            ))
        }
    </GoogleMap>
));

//Cac dia diem xung quanh
class MarkerDetailInfoModalTabNearByFireHydrant extends Component {

    constructor(props) {
        super(props);

        this.state = {
            datas: [],
            markerPlace: {
                position: { lat: 0, lng: 0 },
                key: Date.now,
                defaultAnimation: 2,
            },
            center: { lat: 21.028952, lng: 105.852394 }
        };
        this.handleFireHydrantMarkerOnMouseOut = this.handleFireHydrantMarkerOnMouseOut.bind(this);
        this.handleFireHydrantMarkerOnMouseOver = this.handleFireHydrantMarkerOnMouseOver.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
    };

    handleFireHydrantMarkerOnMouseOut(targetMarker) {
        this.setState({
            datas: this.state.datas.map(marker => {
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
        google.maps.event.trigger(map, 'resize');
        
    }

    handleFireHydrantMarkerOnMouseOver(targetMarker) {
        this.setState({
            datas: this.state.datas.map(marker => {
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

    componentWillReceiveProps(props) {
        var cloneStores = mobx.toJS(props.mapStores);

        var self = this;
        var token = localStorage.getItem('token');
        var json = {}
        json.lat = props.lat;
        json.long = props.long;
        json.distance = props.distance;
        //
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });

        instance.post('/FireHydrant/NearByFireHydrant', json).then(function (response) {
            self.setState({
                datas: response.data.data,
                markerPlace: {
                    position: { lat: _.toNumber(props.lat), lng: _.toNumber(props.long) },
                    key: Date.now,
                    defaultAnimation: 2,
                },
                center: { lat: _.toNumber(props.lat), lng: _.toNumber(props.long) }

            });


        });

    }

    render() {
        return (
            <div>
                <GettingStartedGoogleMap
                    center={this.state.center}
                    containerElement={
                        <div style={styleContainer} />
                    }
                    mapElement={
                        <div style={styleMap} />
                    }
                    markerPlace={
                        this.state.markerPlace
                    }
                    fireHydrantsMarkers={
                        this.state.datas
                    }
                    onMapMounted={this.handleMapMounted}

                    onFireHydrantMarkerMouseOut={this.handleFireHydrantMarkerOnMouseOut}
                    onFireHydrantMarkerMouseOver={this.handleFireHydrantMarkerOnMouseOver}
                />
                <BootstrapTable
                    data={this.state.datas}
                    deleteRow={false}
                    insertRow={false}
                    search={true}
                    pagination
                    striped
                    hover>
                    <TableHeaderColumn dataField={'_id'} isKey hidden>
                        ID Trụ nước
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='name' >
                        Tên trụ nước
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='address'>
                        Địa chỉ
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='distance'>
                        Khoảng cách
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='desc'>
                        Mô tả
                    </TableHeaderColumn>

                </BootstrapTable>
            </div>

        );
    }
}

export default observer(MarkerDetailInfoModalTabNearByFireHydrant);