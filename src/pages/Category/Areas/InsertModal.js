import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { Config } from '../../../Config';
import _ from 'lodash';

class InsertModal extends Component {

    constructor(props) {
        super(props);
        this.state = { txtId: '', txtName: '', txtIdValid: true, txtNameValid: true };
        this.handleChanged = this.handleChanged.bind(this);
        this.onSave = this.onSave.bind(this);
    };

    onSave(event) {

        if (this.props.isNewParent) {
            if (this.state.txtIdValid && this.state.txtNameValid && this.state.txtId.length > 0 && this.state.txtName.length > 0) {
                //Them moi node cha
                var self = this;
                var token = localStorage.getItem('token');
                var params = new URLSearchParams();
                params.append('id', this.state.txtId);
                params.append('name', this.state.txtName);

                var instance = axios.create({
                    baseURL: Config.ServiceUrl,
                    timeout: Config.RequestTimeOut,
                    auth: {
                        username: Config.basicAuthUsername,
                        password: Config.basicAuthPassword
                    },
                    headers: { 'x-access-token': token }
                });
                instance.post('/Area/InsertParentArea', params).then(function (response) {
                    self.setState({ datas: response.data.data });
                    self.props.onHide();
                });

            }
        }
        else {
            //Them moi node con
            if (this.state.txtIdValid && this.state.txtNameValid && this.state.txtId.length > 0 && this.state.txtName.length > 0) {
                var self2 = this;
                var token2 = localStorage.getItem('token');
                var params2 = new URLSearchParams();
                params2.append('parent', this.props.parentId);
                params2.append('id', this.state.txtId);
                params2.append('name', this.state.txtName);

                var instance2 = axios.create({
                    baseURL: Config.ServiceUrl,
                    timeout: Config.RequestTimeOut,
                    auth: {
                        username: Config.basicAuthUsername,
                        password: Config.basicAuthPassword
                    },
                    headers: { 'x-access-token': token2 }
                });
                instance2.post('/Area/InsertChildArea', params2).then(function (response) {
                    self2.setState({ datas: response.data.data });
                    self2.props.onHide();
                });
            }
        }
    }

    handleChanged(e) {
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state, (a) => {
            var self = this;
            if (e.target.name === 'txtId') {
                if (e.target.value.length === 0) {
                    self.setState({ txtIdValid: false });
                }
                else {
                    //Check trung txtId
                    var token = localStorage.getItem('token');
                    var params = new URLSearchParams();
                    params.append('id', e.target.value);
                    var instance = axios.create({
                        baseURL: Config.ServiceUrl,
                        timeout: Config.RequestTimeOut,
                        auth: {
                            username: Config.basicAuthUsername,
                            password: Config.basicAuthPassword
                        },
                        headers: { 'x-access-token': token }
                    });
                    instance.post('/Area/CheckExistId', params).then(function (response) {
                        if (response.data.found === 1) {
                            self.setState({ txtIdValid: false });
                        } else {
                            self.setState({ txtIdValid: true });
                        }

                    });

                }
            }
            if (this.state.txtName.length === 0) {
                this.setState({ txtNameValid: false });
            } else {
                this.setState({ txtNameValid: true });

            }
        });
    }

    render() {
        const inputValidClass = "form-group form-md-line-input form-md-floating-label";
        const inputNotValidClass = inputValidClass + " has-error";
        const { isNewParent, parentId, ...rest } = this.props;

        return (
            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={inputValidClass} >
                        <input onChange={this.handleChanged} type="text" readOnly='true' className="form-control" id="idTxtParent" name="txtParent" value={isNewParent ? "Nhánh chính" : parentId} />
                        <label htmlFor="idTxtParent">Khu vực cha</label>

                    </div>
                    <div className={this.state.txtIdValid ? inputValidClass : inputNotValidClass}>
                        <div className="input-group right-addon">
                            <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtId" name="txtId" />
                            <label htmlFor="idTxtId">ID Khu vực</label>
                            <span className="input-group-addon">
                                <i className={this.state.txtIdValid ? "fa fa-check font-blue" : "fa fa-ban font-red"}></i>
                            </span>
                        </div>
                    </div>

                    <div className={this.state.txtNameValid ? inputValidClass : inputNotValidClass}>
                        <div className="input-group right-addon">
                            <input onChange={this.handleChanged} type="text" className="form-control" id="idTxtName" name="txtName" />
                            <label htmlFor="idTxtName">Tên Khu vực</label> <span className="input-group-addon">
                                <i className={this.state.txtNameValid ? "fa fa-check font-blue" : "fa fa-ban font-red"}></i>
                            </span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.onSave} className="btn blue">Lưu lại</button>
                    <button onClick={this.props.onHide} className="btn red">Đóng</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default InsertModal;