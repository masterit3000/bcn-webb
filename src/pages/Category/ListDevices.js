import React, { Component } from 'react';
import PageHead from '../PageHead';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import axios from 'axios';
import { Config } from '../../Config';
import ListDevicesCss from './ListDevices.css';
import { Modal, Button } from 'react-bootstrap';

const tableName = 'DeviceLocations';
const keyTableName = 'markerId';

function nameEditValidator(value) {
    if (!value) {
        return 'Bạn chưa nhập tên!'
    }
    return true;
}

function addressValidator(value) {
    if (!value) {
        return 'Bạn chưa địa chỉ!'
    }
    return true;
}

function onAfterDeleteRow(rowKeys) {

    var obj = Object();
    obj.table = tableName;
    obj.key = keyTableName;
    obj.values = rowKeys;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: 1000,
        headers: { 'x-access-token': token }
    });
    instance.post('Common/DeleteData', obj).then(function (response) {
        console.log(response);
    });
}

function onAfterUpdateCell(row, cellName, cellValue) {

    var obj = Object();
    obj.table = tableName;
    obj.key = keyTableName;
    obj.value = row[keyTableName];
    obj.cellName = cellName;
    obj.cellValue = cellValue;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: 1000,
        headers: { 'x-access-token': token }
    });
    instance.post('Common/UpdateData', obj).then(function (response) {
    });
}

class ListDeviceTable extends React.Component {

    handleInsertButtonClick = (onClick) => {
        // Custom your onClick event here,
        // it's not necessary to implement this function if you have no any process before onClick
        this.props.showInsertModal();
    }

    createCustomInsertButton = (onClick) => {
        return (
            <InsertButton
                btnText='Thêm mới'
                btnContextual='btn-primary'
                className='btn-add'
                btnGlyphicon='glyphicon-edit'
                onClick={() => this.handleInsertButtonClick(onClick)} />
        );
    }
    render() {
        var devices = this.props.devices;
        const options = {
            afterDeleteRow: onAfterDeleteRow,
            deleteText: 'Xóa',
            insertBtn: this.createCustomInsertButton
        };

        const selectRowProp = {
            mode: 'checkbox'
        };

        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: onAfterUpdateCell
        };
        return (

            <BootstrapTable
                data={devices}
                deleteRow={true}
                insertRow={true}
                selectRow={selectRowProp}
                options={options}
                cellEdit={cellEditProp}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn dataField={'markerId'} isKey>
                    Device Id
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='name' editable={{ type: 'text', validator: nameEditValidator }}>
                    Tên tủ báo cháy
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='address' editable={{ type: 'text', validator: addressValidator }}>
                    Địa chỉ
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='phone' editable={{ type: 'text' }}>
                    Số điện thoại
                    </TableHeaderColumn>
            </BootstrapTable>

        );
    }
}

const InsertModal = React.createClass({
    render() {
        return (
            <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Thêm mới tủ báo cháy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    a
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide} bsStyle="danger">Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});


class ListDevices extends Component {
    constructor() {
        super();
        this.state = { devices: [], isShowInsertModal: false };
        this.showInsertModal = this.showInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
    }

    showInsertModal() {
        this.setState({ isShowInsertModal: true });
    }
    closeInsertModal() {
        this.setState({ isShowInsertModal: false });
    }

    componentWillMount() {
        var self = this;
        var token = localStorage.getItem('token');
        var params = new URLSearchParams();
        params.append('table', tableName);
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: 1000,
            headers: { 'x-access-token': token }
        });
        instance.post('Common/GetData', params).then(function (response) {
            self.setState({ devices: response.data.data });
        });
    }

    render() {

        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <InsertModal show={this.state.isShowInsertModal} onHide={this.closeInsertModal} />
                {/*<!-- BEGIN PAGE HEAD -->*/}
                <PageHead title="Danh sách tủ báo cháy" subTitle="Danh sách tủ báo cháy" />
                {/*<!-- END PAGE HEAD -->*/}
                {/*<!-- BEGIN PAGE CONTENT -->*/}
                <div className="page-content">
                    <div className="container-fluid">
                        {/*<!-- BEGIN PAGE CONTENT INNER -->*/}
                        <div className="row">
                            <div className="col-md-12">

                                <div className="portlet light">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="fa fa-list-alt" aria-hidden="true"></i>
                                            Danh sách tủ báo cháy
							            </div>
                                        <div className="tools">
                                            <a href="javascript:;" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">

                                        <ListDeviceTable showInsertModal={this.showInsertModal} devices={this.state.devices} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<!-- END PAGE CONTENT INNER -->*/}
                    </div>
                </div>

                {/*<!-- END PAGE CONTENT -->*/}
            </div>
        );
    }
}

export default ListDevices;