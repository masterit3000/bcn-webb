import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { Config } from '../../../Config';
import _ from 'lodash';

class UpdateModal extends Component {

    constructor(props) {
        super(props);
        this.state = { txtName: '', txtNameValid: true };
        this.handleChanged = this.handleChanged.bind(this);
        this.onSave = this.onSave.bind(this);
    };

    onSave(event) {
        var self = this;
        var token = localStorage.getItem('token');
        var params = new URLSearchParams();
        params.append('id', this.props.updateId);
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
        instance.post('/Area/UpdateArea', params).then(function (response) {
            self.props.onHide();
        });
    }

    handleChanged(e) {
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state, (a) => {
            if (this.state.txtName.length === 0) {
                this.setState({ txtNameValid: false });
            } else {
                this.setState({ txtNameValid: true });
            }
        });


    }

    render() {
        const inputValidClass = "form-group form-md-line-input";
        const inputNotValidClass = inputValidClass + " has-error";
        const { updateId, updateName, ...rest } = this.props;

        return (
            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={this.state.txtIdValid ? inputValidClass : inputNotValidClass}>
                        <div className="input-group right-addon">
                            <input onChange={this.handleChanged} type="text" readOnly='true' className="form-control" id="idTxtId" name="txtId" value={updateId} />
                            <label htmlFor="idTxtId">ID Khu vực</label>
                            <span className="input-group-addon">
                                <i className="fa fa-check font-blue"></i>
                            </span>
                        </div>
                    </div>

                    <div className={this.state.txtNameValid ? inputValidClass : inputNotValidClass}>
                        <div className="input-group right-addon">
                            <input onChange={this.handleChanged} defaultValue={updateName} type="text" className="form-control" id="idTxtName" name="txtName" />
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

export default UpdateModal;