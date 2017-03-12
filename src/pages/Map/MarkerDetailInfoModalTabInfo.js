import React, { Component } from 'react';

class MarkerDetailInfoModalTabInfo extends Component {
    render() {
        return (
            <div>
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                ID:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.markerId}</b>
                            </div>
                        </div>

                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                Tên:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.name}</b>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                Địa chỉ:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.address}</b>
                            </div>
                        </div>

                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                Điện thoại:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.phone}</b>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                Imei:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.imei}</b>
                            </div>
                        </div>

                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                Mô tả:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.desc}</b>
                            </div>
                        </div>

                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                Trạng thái:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.isOnline ?
                                    <div className="font-blue">Đang online</div> :
                                    <div className="font-red">Offline</div>}</b>
                            </div>
                        </div>

                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-2">
                                Trạng thái usb:
                            </div>
                            <div className="col-md-10">
                                <b>{this.props.data.powerCordState ?
                                    <div className="font-blue">Đang cắm sạc</div> :
                                    <div className="font-red">Không cắm sạc</div>}</b>
                            </div>
                        </div>

                    </li>
                </ul>
            </div>
        );
    }
}

export default MarkerDetailInfoModalTabInfo;