import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import MarkerDetailInfoModalTabInfo from './MarkerDetailInfoModalTabInfo';
import MarkerDetailInfoModalTabNearByLocations from './MarkerDetailInfoModalTabNearByLocations';
import DeviceLogModalTable from './DeviceLogModalTable';
import axios from 'axios';
import { Config } from '../../Config';

class MarkerDetailInfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = { deviceLogs: [] };
    };

    
    render() {
        const { data, onHide, ...rest } = this.props;

        //Load logs
        var self = this;
        var token = localStorage.getItem('token');
        var json = {}
        json.markerId = data.markerId;
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });

        instance.post('/DeviceRoute/GetDeviceLogs', json).then(function (response) {

            self.setState({ deviceLogs: response.data.data });
        });

        return (
            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">
                        <i className="fa fa-fire" aria-hidden="true"></i>
                        {data.name} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="tabbable-line">
                        <ul className="nav nav-tabs ">
                            <li className="active">
                                <a href="#tab1" data-toggle="tab">
                                    Thông tin chi tiết </a>
                            </li>
                            <li>
                                <a href="#tab2" data-toggle="tab">
                                    Nhật ký </a>
                            </li>
                            <li>
                                <a href="#tab2" data-toggle="tab">
                                    Dạng kiến trúc công trình </a>
                            </li>
                            <li>
                                <a href="#tab3" data-toggle="tab">
                                    Đặc điểm giao thông xung quanh </a>
                            </li>
                            <li>
                                <a href="#tab4" data-toggle="tab">
                                    Thông tin từ tủ </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane active" id="tab1">
                                <MarkerDetailInfoModalTabInfo data={data} />
                            </div>
                            <div className="tab-pane" id="tab2">
                                <DeviceLogModalTable logs={this.state.deviceLogs} />
                            </div>
                            <div className="tab-pane" id="tab3">
                                <MarkerDetailInfoModalTabNearByLocations lat={data.lat} long={data.long} radius="500" />
                            </div>
                            <div className="tab-pane" id="tab4">

                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide} bsStyle="danger"><i className="fa fa-times" aria-hidden="true"></i>Đóng</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default MarkerDetailInfoModal;