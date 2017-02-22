import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../../Config';
import { Modal, Button, FormGroup, ControlLabel, HelpBlock, Grid, Row, Col } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import PageHead from '../../PageHead';
import FollowModal from './FollowModal';
import AdminTable from './AdminTable';
import _ from 'lodash';

const tableName = 'admins';

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


class ManageAdmins extends Component {

    constructor(props) {
        super(props);
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
            isCreateFailedText: '',
            showFollowModal: false
        };
        this.showInsertModal = this.showInsertModal.bind(this);
        this.hideInsertModal = this.hideInsertModal.bind(this);
        this.handleChanged = this.handleChanged.bind(this);
        this.doInsert = this.doInsert.bind(this);
        this.loadData = this.loadData.bind(this);
        this.showFollowModal = this.showFollowModal.bind(this);
        this.closeFollowModal = this.closeFollowModal.bind(this);
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
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
            var json = {};

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
                self.setState({ isCreateFailed: false, showInsertModal: false });
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
                var token2 = localStorage.getItem('token');
                var params2 = new URLSearchParams();
                params2.append('table', tableName);
                params2.append('column', 'email');
                params2.append('value', e.target.value);
                var instance2 = axios.create({
                    baseURL: Config.ServiceUrl,
                    timeout: Config.RequestTimeOut,
                    headers: { 'x-access-token': token2 }
                });
                instance2.post('/Common/FindOne', params2).then(function (response) {
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

    closeFollowModal() {
        this.setState({ showFollowModal: false });
    }

    showFollowModal(id) {
        this.setState({ showFollowModal: true, followId: id });
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
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <AdminTable showFollowModal={this.showFollowModal} showInsertModal={this.showInsertModal} products={this.state.admins} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<!-- END PAGE CONTENT INNER -->*/}
                    </div>
                </div>

                {/*<!-- END PAGE CONTENT -->*/}
                <FollowModal closeFollowModal={this.closeFollowModal} show={this.state.showFollowModal} followId={this.state.followId} />

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