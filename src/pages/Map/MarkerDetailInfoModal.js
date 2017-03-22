import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import MarkerDetailInfoModalTabInfo from './MarkerDetailInfoModalTabInfo';
import MarkerDetailInfoModalTabNearByLocations from './MarkerDetailInfoModalTabNearByLocations';
import DeviceLogModalTable from './DeviceLogModalTable';
import axios from 'axios';
import { Config } from '../../Config';
import {Table} from 'react-bootstrap';
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
                                <DeviceLogModalTable logs={this.state.deviceLogs} />
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
                               <p>
                                            - Công trình cao 10 tầng<br />
                                            - Khối tích: 6000m3<br />
                                            - Số lượng người thường trực: 50 người<br />
                                            <img src="http://eurowindow.biz/Uploads/_2016/benh-vien-vn-cuba.gif" width="300px" height="auto" /><br /><br />
                                            <img src="http://dantri4.vcmedia.vn/6DQQJ7yW5QPfG6EzuGal/Image/2013/09/3-ad235.jpg" width="300px" height="auto" />

                                </p>
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