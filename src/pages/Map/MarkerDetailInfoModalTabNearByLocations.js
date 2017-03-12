import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../Config';
//Cac dia diem xung quanh
class MarkerDetailInfoModalTabNearByLocations extends Component {

    componentDidMount() {

        // var self = this;
        // var token = localStorage.getItem('token');
        // var json = {}
        // json.lat = this.props.lat;
        // json.long = this.props.long;
        // json.radius = this.props.radius;

        // var instance = axios.create({
        //     baseURL: Config.ServiceUrl,
        //     timeout: Config.RequestTimeOut,
        //     auth: {
        //         username: Config.basicAuthUsername,
        //         password: Config.basicAuthPassword
        //     },
        //     headers: { 'x-access-token': token }
        // });
        // instance.post('url', json).then(function (response) {
        //     self.setState({ datas: response.data.data });
        // });

        // var self = this;
        // var json = {};
        // var instance = axios.create({
        //     baseURL: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        //     this.props.lat + "," + this.props.long +
        //     "&radius=" + this.props.radius +
        //     "&key=" + Config.GoogleMapAPIKey,
        //     timeout: Config.RequestTimeOut
        // });
        // instance.post('', json).then(function (response) {
        //     console.log(response);
        // });
    }

    render() {
        return (
            <div>
                tab2
            </div>
        );
    }
}

export default MarkerDetailInfoModalTabNearByLocations;