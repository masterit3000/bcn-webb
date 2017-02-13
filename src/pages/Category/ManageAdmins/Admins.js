import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import axios from 'axios';
import { Config } from '../../../Config';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import PageHead from '../../PageHead';
import _ from 'lodash';

const tableName = 'admins';
const keyTableName = 'userId';

var AvatarDropzone = React.createClass({
    onDrop: function (files) {
        console.log('Received files: ', files);
    },

    render: function () {
        return (
            <div>
                <Dropzone className="custom-dz" multiple={false} onDrop={this.onDrop}>
                    <div>&nbsp;&nbsp; Chọn ảnh...</div>
                </Dropzone>
            </div>
        );
    }
});

function imageFormatter(cell, row) {
    return "<img class='img-circle' style='width:25px; height:25px;' src='" + cell + "'/>";
}

function onAfterDeleteRow(rowKeys) {

    var obj = Object();
    obj.table = tableName;
    obj.key = keyTableName;
    obj.values = rowKeys;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.apiUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('/Common/DeleteData', obj).then(function (response) {
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
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('/Common/UpdateData', obj).then(function (response) {
    });
}

// validator function pass the user input value and should return true|false.
function nameEditValidator(value) {
    if (!value) {
        return 'Bạn chưa nhập tên!'
    }
    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// validator function pass the user input value and should return true|false.
function emailEditValidator(value) {
    if (!value) {
        return 'Bạn chưa nhập email!';
    } else if (!validateEmail(value)) {
        return 'Sai định dạng email!';
    }
    return true;
}

class AdminTable extends React.Component {

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
        var products = this.props.products;
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
                data={products}
                deleteRow={true}
                insertRow={true}
                selectRow={selectRowProp}
                options={options}
                cellEdit={cellEditProp}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn dataField='avatar'
                    dataFormat={imageFormatter}>
                    Ảnh đại diện
                    </TableHeaderColumn>
                <TableHeaderColumn dataField={keyTableName} isKey>
                    Mã Admin
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='name' editable={{ type: 'text', validator: nameEditValidator }}>
                    Tên
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='email' editable={{ type: 'text', validator: emailEditValidator }}>
                    Email
                    </TableHeaderColumn>
                    
            </BootstrapTable>

        );
    }
}

class ManageAdmins extends Component {

    constructor() {
        super();
        this.state = {
            admins: [],
            showInsertModal: false,
            value: '',
            isNotvalidUsername: false,
            isNotValidEmail: false,
            isNotValidPassword: false,
            isNotValidPasswordRetype: false,
            isNotValidName: false,
            isCreateFailed: false,
            isCreateFailedText: ''
        };
        this.showInsertModal = this.showInsertModal.bind(this);
        this.hideInsertModal = this.hideInsertModal.bind(this);
        this.handleChanged = this.handleChanged.bind(this);
        this.doInsert = this.doInsert.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentWillMount() {
        this.loadData();
    }

    loadData(){
        var self = this;
        var token = localStorage.getItem('token');
        var params = new URLSearchParams();
        params.append('table', tableName);
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            headers: { 'x-access-token': token }
        });
        instance.post('/Common/GetData', params).then(function (response) {
            console.log(response.data);
            self.setState({ admins: response.data.data });
        });
    }

    showInsertModal() {
        this.setState({ showInsertModal: true });
    }

    hideInsertModal() {
        this.setState({ showInsertModal: false });
    }

    doInsert(event) {
        if (this.state.isNotValidEmail || this.state.isNotValidName
            || this.state.isNotValidPassword || this.state.isNotValidPasswordRetype
            || this.state.isNotvalidUsername) {
            this.setState({ isCreateFailed: true, isCreateFailedText: 'Bạn phải nhập đúng các trường trước khi thêm mới' })
        } else {
            //do insert admin
            var self = this;
            var token = localStorage.getItem('token');
            var json = new Object();

            json.username = this.state.txtUsername;
            json.password = this.state.txtPassword;
            json.email = this.state.txtEmail;
            json.name = this.state.txtName;
            json.avatar = this.state.txtAvatar;

            var instance = axios.create({
                baseURL: Config.ServiceUrl,
                timeout: Config.RequestTimeOut,
                headers: { 'x-access-token': token }
            });
            instance.post('/Admin/CreateUser', json).then(function (response) {
                self.setState({ isCreateFailed: false, showInsertModal:false });
                self.loadData();
            });
        }

    }

    handleChanged(e) {
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);

        var self = this;
        if (e.target.name === 'txtUsername') {

            //Check trung txtUsername
            var token = localStorage.getItem('token');
            var params = new URLSearchParams();
            params.append('table', tableName);
            params.append('column', 'userId');
            params.append('value', e.target.value);
            var instance = axios.create({
                baseURL: Config.ServiceUrl,
                timeout: Config.RequestTimeOut,
                headers: { 'x-access-token': token }
            });
            instance.post('/Common/FindOne', params).then(function (response) {
                var found = response.data.data
                if (found && _.size(found) > 0) {
                    self.setState({ isNotvalidUsername: true });
                } else {
                    self.setState({ isNotvalidUsername: false });
                }
            });
        } else if (e.target.name === 'txtEmail') {
            // validateEmail 
            var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!regex.test(e.target.value)) {
                self.setState({ isNotValidEmail: true });
            } else {
                //Check trung email
                var token = localStorage.getItem('token');
                var params = new URLSearchParams();
                params.append('table', tableName);
                params.append('column', 'email');
                params.append('value', e.target.value);
                var instance = axios.create({
                    baseURL: Config.ServiceUrl,
                    timeout: Config.RequestTimeOut,
                    headers: { 'x-access-token': token }
                });
                instance.post('/Common/FindOne', params).then(function (response) {
                    var found = response.data.data

                    if (found && _.size(found) > 0) {
                        self.setState({ isNotValidEmail: true });
                    } else {
                        self.setState({ isNotValidEmail: false });
                    }
                });

            }

        } else if (e.target.name === 'txtPassword') {

            if (e.target.value.length === 0 || !_.isEqual(e.target.value, this.state.txtPasswordRetype)) {
                self.setState({ isNotValidPassword: true });
            } else {
                if (_.isEqual(e.target.value, this.state.txtPasswordRetype)) {
                    self.setState({ isNotValidPasswordRetype: false });
                    self.setState({ isNotValidPassword: false });
                }

            }
        } else if (e.target.name === 'txtPasswordRetype') {
            if (e.target.value.length === 0 || !_.isEqual(e.target.value, this.state.txtPassword)) {
                self.setState({ isNotValidPasswordRetype: true });
            } else {
                if (_.isEqual(this.state.txtPassword, e.target.value)) {
                    self.setState({ isNotValidPassword: false });
                    self.setState({ isNotValidPasswordRetype: false });
                }

            }
        } else if (e.target.name === 'isNotValidName') {
            if (e.target.value.length === 0) {
                this.setState({ isNotValidName: true });
            } else {
                this.setState({ isNotValidName: false });
            }
        }
    }

    render() {

        const inputValidClass = "form-group form-md-line-input form-md-floating-label";
        const inputNotValidClass = "form-group form-md-line-input form-md-floating-label has-error";

        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                {/*<!-- BEGIN PAGE HEAD -->*/}
                <PageHead title="Danh sách người dùng" subTitle="Danh sách người dùng" />
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
                                            Danh sách người dùng
							            </div>
                                        <div className="tools">
                                            <a href="javascript:;" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <AdminTable showInsertModal={this.showInsertModal} products={this.state.admins} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<!-- END PAGE CONTENT INNER -->*/}
                    </div>
                </div>

                {/*<!-- END PAGE CONTENT -->*/}

                <Modal
                    animation={true}
                    show={this.state.showInsertModal}
                    onHide={this.hideInsertModal}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">Thêm mới người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.isCreateFailed ? (
                                <div className="alert alert-warning" style={{ margin: "10px 10px 10px 10px" }}>
                                    <strong>Cảnh báo!</strong> {this.state.isCreateFailedText}
                                </div>
                            ) : null
                        }
                        <Grid>
                            <Row>
                                <Col xs={2} md={2}>
                                    <FormGroup
                                        controlId="dzUpload"
                                    >
                                        <ControlLabel>Avatar</ControlLabel>
                                        <AvatarDropzone />
                                        <HelpBlock>Chọn / kéo thả để upload ảnh</HelpBlock>
                                    </FormGroup>
                                </Col>
                                <Col xs={2} md={2}>
                                    <img className="img-circle" src="" alt="upload-avatar" />
                                </Col>
                            </Row>
                        </Grid>

                        {/* Modal body */}
                        <div className={!this.state.isNotvalidUsername ?
                            inputValidClass :
                            inputNotValidClass}>
                            <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtUsername" name="txtUsername" />
                            <label htmlFor="idTxtUsername">Tên đăng nhập</label>
                        </div>
                        <div className={!this.state.isNotValidName ?
                            inputValidClass :
                            inputNotValidClass}>
                            <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtName" name="txtName" />
                            <label htmlFor="idTxtName">Họ và tên</label>
                        </div>
                        <div className={!this.state.isNotValidEmail ?
                            inputValidClass :
                            inputNotValidClass}>
                            <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtEmail" name="txtEmail" />
                            <label htmlFor="idTxtEmail">Email</label>
                        </div>
                        <div className={!this.state.isNotValidPassword ?
                            inputValidClass :
                            inputNotValidClass}>
                            <input onChange={this.handleChanged} type="password" className="form-control" id="idTxtPassword" name="txtPassword" />
                            <label htmlFor="idTxtPassword">Mật khẩu</label>
                        </div>
                        <div className={!this.state.isNotValidPasswordRetype ?
                            inputValidClass :
                            inputNotValidClass}>
                            <input onChange={this.handleChanged} type="password" className="form-control" id="idTxtPasswordRetype" name="txtPasswordRetype" />
                            <label htmlFor="idTxtPasswordRetype">Nhập lại Mật khẩu</label>
                        </div>
                        {/* End Modal body */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="warning" onClick={this.hideInsertModal}>
                            <i className="fa fa-close"></i>&nbsp;&nbsp;Đóng
                        </Button>
                        <Button bsStyle="primary" onClick={this.doInsert}>
                            <i className="fa fa-plus"></i>&nbsp;&nbsp;Thêm mới
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>



        );
    }
}

export default ManageAdmins;