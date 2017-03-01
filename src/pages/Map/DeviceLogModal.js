import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DeviceLogModalTable from './DeviceLogModalTable';

class DeviceLogModal extends Component {
    render() {
        const { logs, onHide, ...rest } = this.props;

        return (
            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">
                        <i className="fa fa-history" aria-hidden="true"></i>
                        &nbsp; Logs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DeviceLogModalTable logs={logs} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide} bsStyle="danger"><i className="fa fa-times" aria-hidden="true"></i>Đóng</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DeviceLogModal;