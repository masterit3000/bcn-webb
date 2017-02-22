import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { ListAndroidDevicesConst } from './ListAndroidDevicesConst';
import axios from 'axios';
import { Config } from '../../../Config';
import './style.css';

function onAfterDeleteRow(rowKeys) {
    var obj = Object();
    obj.table = ListAndroidDevicesConst.tableName;
    obj.key = ListAndroidDevicesConst.keyTableName;
    obj.values = rowKeys;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('Common/DeleteData', obj).then(function (response) {
        console.log(response);
    });
}

class ListAndroidDevicesTable extends Component {

    constructor(props) {
        super(props);
        this.approve = this.approve.bind(this);
        this.deny = this.deny.bind(this);
        this.statusFormat = this.statusFormat.bind(this);

    }

    statusFormat(cell, row) {
        if (cell === 0) {

            //chua duyet   
            return (
                <div className="btn-group">
                    <a className="btn dropdown-toggle bg-grey-gallery btn-table" data-toggle="dropdown" data-hover="dropdown" data-delay="1000" data-close-others="true" href="#">
                        Chưa duyệt <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="dropdown-menu chua-duyet">
                        <li>
                            <a href="#" onClick={this.approve} data-imei={row.imei} className="font-blue">
                                Duyệt
                        </a></li>
                        <li>
                            <a href="#" onClick={this.deny} data-imei={row.imei} className="font-red">
                                Từ chối
                        </a>
                        </li>
                    </ul>
                </div>
            )
        } else if (cell === 1) {
            //Da duyet 
            return (
                <div className="btn-group">
                    <a className="btn dropdown-toggle bg-blue btn-table" data-toggle="dropdown" data-hover="dropdown" data-delay="1000" data-close-others="true" href="#">
                        Đã duyệt <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="dropdown-menu da-duyet">
                        <li >
                            <a href="#" onClick={this.deny} data-imei={row.imei} className="font-red">
                                Từ chối
                        </a>
                        </li>
                    </ul>
                </div>)

        } else if (cell === 2) {
            //Da duoc asign
            return (
                <span className="label label-primary">
                    Đã kết nối với tủ </span>
            );
        } else if (cell === 3) {
            //Tu choi
            return (
                <div className="btn-group">
                    <a className="btn dropdown-toggle bg-red btn-table" data-toggle="dropdown" data-hover="dropdown" data-delay="1000" data-close-others="true" href="#">
                        Từ chối <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="dropdown-menu tu-choi">
                        <li >
                            <a href="#" onClick={this.approve} data-imei={row.imei} className="font-blue">
                                Duyệt lại
                        </a>
                        </li>
                    </ul>
                </div>
            )
        }
    }

    deny(e) {
        var self = this;
        var imei = e.target.dataset.imei;
        var obj = Object();
        obj.imei = imei;
        obj.status = 3;

        var token = localStorage.getItem('token');
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            headers: { 'x-access-token': token },
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            }
        });
        instance.post('InitDeviceRoute/ChangeDeviceState', obj).then(function (response) {
            self.props.loadData();
        });
    }

    approve(e) {
        var self = this;
        var imei = e.target.dataset.imei;
        var obj = Object();
        obj.imei = imei;
        obj.status = 1;

        var token = localStorage.getItem('token');
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            headers: { 'x-access-token': token },
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            }
        });
        instance.post('InitDeviceRoute/ChangeDeviceState', obj).then(function (response) {
            self.props.loadData();
        });
    }

    render() {
        const options = {
            afterDeleteRow: onAfterDeleteRow,
            deleteText: 'Xóa',
            insertBtn: this.createCustomInsertButton
        };
        const selectRowProp = {
            mode: 'checkbox'
        };
        return (
            <BootstrapTable
                data={this.props.devices}
                selectRow={selectRowProp}
                deleteRow={true}
                options={options}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn dataField={'imei'} isKey>
                    Imei
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='manufacture'>
                    Hãng sản xuất
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='deviceName'>
                    Tên máy
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='status' dataFormat={this.statusFormat}>
                    Trạng thái
                    </TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default ListAndroidDevicesTable;