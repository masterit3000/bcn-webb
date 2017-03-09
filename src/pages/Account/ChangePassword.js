import React, { Component } from 'react';
import { Config } from '../../Config';
import axios from 'axios';
import _ from 'lodash';
import { Modal, Button } from 'react-bootstrap';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOldPasswordError: false, oldPasswordErrorText: '',
            isPasswordError: false, passwordErrorText: '',
            isRePasswordError: false, rePasswordErrorText: '',
            showModal: false
        };
        this.handleChanged = this.handleChanged.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.closeModal = this.closeModal.bind(this);
    };

    closeModal(event) {
        this.setState({ showModal: false });
    }

    changePassword(event) {
        var self = this;
        if (!this.state.isOldPasswordError &&
            !this.state.isPasswordError &&
            !this.state.isRePasswordError) {
            var token = localStorage.getItem('token');
            var json = {};
            json.oldPassword = this.state.txtOldPassword;
            json.newPassword = this.state.txtReNewPassword;

            var instance = axios.create({
                baseURL: Config.ServiceUrl,
                timeout: Config.RequestTimeOut,
                auth: {
                    username: Config.basicAuthUsername,
                    password: Config.basicAuthPassword
                },
                headers: { 'x-access-token': token }
            });
            instance.post('/Account/ChangePassword', json).then(function (response) {
                var res = response.data;
                if (res.ResponseCode === 0) {
                    self.setState({ showModal: true, modalTitle: "Lỗi", modalText: "Không thể thay đổi mật khẩu" });
                } else {
                    self.setState({ showModal: true, modalTitle: "Thành công", modalText: "Mật khẩu của bạn đã được thay đổi" });
                }
            });
        }

    }


    handleChanged(event) {
        event.persist();
        var self = this;
        var state = {};
        state[event.target.name] = event.target.value;
        this.setState(state, () => {
            if (event.target.name === "txtOldPassword") {
                if (event.target.value.length > 0) {
                    var token = localStorage.getItem('token');
                    var json = {}
                    json.oldPassword = event.target.value;
                    var instance = axios.create({
                        baseURL: Config.ServiceUrl,
                        timeout: Config.RequestTimeOut,
                        auth: {
                            username: Config.basicAuthUsername,
                            password: Config.basicAuthPassword
                        },
                        headers: { 'x-access-token': token }
                    });
                    instance.post('/Account/CheckPassword', json).then(function (response) {
                        var res = response.data;
                        if (res.ResponseCode === 0) {
                            self.setState({ isOldPasswordError: true, oldPasswordErrorText: 'Mật khẩu cũ không chính xác' });
                        } else {
                            self.setState({ isOldPasswordError: false, oldPasswordErrorText: '' });
                        }
                    });
                }
                else {
                    self.setState({ isOldPasswordError: true, oldPasswordErrorText: 'Bạn chưa nhập mật khẩu cũ' });
                }
            } else if (event.target.name === "txtNewPassword") {
                if (event.target.value.length === 0) {
                    self.setState({ isPasswordError: true, passwordErrorText: 'Bạn chưa nhập mật khẩu mới' });
                }
                if (!_.isEqual(event.target.value, this.state.txtReNewPassword)) {
                    self.setState({ isPasswordError: true, passwordErrorText: 'Mật khẩu mới không trùng nhau' });
                    self.setState({ isRePasswordError: true, rePasswordErrorText: 'Mật khẩu mới không trùng nhau' });
                } else {
                    self.setState({ isPasswordError: false, passwordErrorText: '' });
                    self.setState({ isRePasswordError: false, rePasswordErrorText: '' });
                }
            } else if (event.target.name === "txtReNewPassword") {
                if (event.target.value.length === 0) {
                    self.setState({ isRePasswordError: true, rePasswordErrorText: 'Bạn chưa nhập lại mật khẩu mới' });
                }
                if (!_.isEqual(event.target.value, this.state.txtNewPassword)) {
                    self.setState({ isPasswordError: true, passwordErrorText: 'Mật khẩu mới không trùng nhau' });
                    self.setState({ isRePasswordError: true, rePasswordErrorText: 'Mật khẩu mới không trùng nhau' });
                } else {
                    self.setState({ isPasswordError: false, passwordErrorText: '' });
                    self.setState({ isRePasswordError: false, rePasswordErrorText: '' });
                }
            }
        });
    }

    render() {
        const inputClass = "form-group form-md-line-input";
        const inputClassHasError = "form-group form-md-line-input has-error";
        return (
            <div className="portlet light">
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.state.modalText}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeModal}>Đóng</Button>
                    </Modal.Footer>
                </Modal>

                <div className="portlet-title">
                    <span className="caption">
                        Đổi mật khẩu
                    </span>
                </div>
                <div className="portlet-body form">
                    <form role="form">
                        <div className="form-body">
                            <div className={this.state.isOldPasswordError ? inputClassHasError : inputClass}>
                                <input type="text" className="form-control" name="txtOldPassword" placeholder="Nhập mật khẩu cũ" onChange={this.handleChanged} />
                                <label htmlFor="txtOldPassword">Mật khẩu cũ</label>
                                <span className="help-block">{this.state.oldPasswordErrorText}</span>
                            </div>
                            <div className={this.state.isPasswordError ? inputClassHasError : inputClass}>
                                <input type="text" className="form-control" name="txtNewPassword" placeholder="Nhập mật khẩu mới" onChange={this.handleChanged} />
                                <label htmlFor="txtNewPassword">Mật khẩu mới</label>
                                <span className="help-block">{this.state.passwordErrorText}</span>
                            </div>
                            <div className={this.state.isRePasswordError ? inputClassHasError : inputClass}>
                                <input type="text" className="form-control" name="txtReNewPassword" placeholder="Nhập lại mật khẩu mới" onChange={this.handleChanged} />
                                <label htmlFor="txtReNewPassword">Nhập lại mật khẩu mới</label>
                                <span className="help-block">{this.state.rePasswordErrorText}</span>
                            </div>
                        </div>
                        <div className="form-actions noborder">
                            <button type="button" className="btn blue" onClick={this.changePassword}>Đổi mật khẩu</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ChangePassword;