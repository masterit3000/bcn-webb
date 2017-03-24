import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import MarkerDetailInfoModalTabInfo from './MarkerDetailInfoModalTabInfo';
import MarkerDetailInfoModalTabNearByLocations from './MarkerDetailInfoModalTabNearByLocations';
import DeviceLogModalTable from './DeviceLogModalTable';
import axios from 'axios';
import { Config } from '../../Config';
import { Table } from 'react-bootstrap';
import renderHTML from 'react-render-html';

class MarkerDetailInfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = { deviceLogs: [] };
    };

    componentWillReceiveProps() {
        // if (!this.props.data.markerId) {
        //     //Load logs
        //     var self = this;
        //     var token = localStorage.getItem('token');
        //     var json = {}
        //     json.markerId = this.props.data.markerId;
        //     var instance = axios.create({
        //         baseURL: Config.ServiceUrl,
        //         timeout: Config.RequestTimeOut,
        //         auth: {
        //             username: Config.basicAuthUsername,
        //             password: Config.basicAuthPassword
        //         },
        //         headers: { 'x-access-token': token }
        //     });

        //     instance.post('/DeviceRoute/GetDeviceLogs', json).then(function (response) {

        //         self.setState({ deviceLogs: response.data.data });
        //     });
        // }
    }

    render() {
        const { data, dataHistory, onHide, ...rest } = this.props;
       
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
                                    Thông tin chung </a>
                            </li>
                            <li>
                                <a href="#tab2" data-toggle="tab">
                                    Nhật ký </a>
                            </li>
                            <li>
                                <a href="#tab3" data-toggle="tab">
                                    Nguồn nước </a>
                            </li>

                            <li>
                                <a href="#tab4" data-toggle="tab">
                                    Thông tin cơ sở </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane active" id="tab1">
                                <MarkerDetailInfoModalTabInfo data={data} />
                            </div>
                            <div className="tab-pane" id="tab2">
                                <DeviceLogModalTable logs={this.props.dataHistory} />
                            </div>
                            <div className="tab-pane" id="tab3">
                                <Table striped bordered condensed hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>
                                                Tên trụ nước
                                                </th>
                                            <th>Vị trí</th>
                                            <th>Khoảng cách</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Trụ 002</td>
                                            <td>Số 3 Trần Phú</td>
                                            <td>30m</td>

                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Trụ 103</td>
                                            <td>Trong bệnh Viện</td>
                                            <td>100m</td>

                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Trụ 70</td>
                                            <td>30 Trần Phú</td>
                                            <td>150m</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                {/*<MarkerDetailInfoModalTabNearByLocations lat={data.lat} long={data.long} radius="500" />*/}
                            </div>
                            <div className="tab-pane" id="tab4">
                                {data.thongTinCoSo ? renderHTML(data.thongTinCoSo) : ''}
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