import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FollowModalNestedList from './FollowModalNestedList';

class FollowModal extends Component {

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
    };

    onClose(e) {
        this.props.closeFollowModal();
    }

    render() {
        const { closeFollowModal, followId, ...rest } = this.props;

        return (

            <Modal {...rest} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg"><i className="fa fa-plus" aria-hidden="true"></i> Danh sách theo dõi </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FollowModalNestedList followId={followId} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onClose} bsStyle="danger"><i className="fa fa-times" aria-hidden="true"></i>Đóng</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FollowModal;