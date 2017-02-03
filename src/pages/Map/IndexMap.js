import React, { Component } from 'react';
import PageHead from '../PageHead';
import GoogleMap from 'google-map-react';
import Marker from './Marker';
import { Config } from '../../Config';
import io from 'socket.io-client';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Sound from 'react-sound';

let socket = io('http://localhost:8899');

class IndexMap extends Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, modalContent: '', listDevices: [] };
        this.close = this.close.bind(this);

    }

    componentDidMount() {
        var self = this;
        socket.on('DeviceIsFire', function (data) {
            self.setState({ showModal: true, modalContent: 'Cảnh báo cháy tại: ' + data.name + ' - ' + data.address + ' - ' + data.phone });
        });
        socket.on('DeviceFireStateChanged', function (data) {

            self.setState({ listDevices: data });
        });

        socket.on('DeviceConnected', function (data) {
            self.setState({ listDevices: data });
        });

        socket.on('DeviceDisconnected', function (data) {
            self.setState({ listDevices: data });
        });

        axios.get(Config.ServiceUrl + '/ListDevices', {})
            .then(function (response) {
                self.setState({ listDevices: response.data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    static defaultProps = {
        center: { lat: 21.028952, lng: 105.852394 },
        zoom: 14
    };

    close() {
        this.setState({ showModal: false });
    }

    render() {
        const style = {
            position: 'relative',
            margin: 0,
            padding: 0,
            flex: 1,
            height: '650px'
        };
        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cảnh báo cháy</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                         <Sound url="assets/fire-alarm-sound.mp3" playStatus="PLAYING" />
                        <p>{this.state.modalContent}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>

                {/*<!-- BEGIN PAGE HEAD -->*/}
                <PageHead title="Bản đồ" subTitle="PCCC" />
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
                                            <i className="fa fa-map-marker"></i>Bản đồ
							            </div>
                                        <div className="tools">
                                            <a href="javascript:;" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <GoogleMap
                                            bootstrapURLKeys={{
                                                key: Config.GoogleMapAPIKey
                                            }}
                                            style={style}
                                            defaultCenter={this.props.center}
                                            defaultZoom={this.props.zoom}>
                                            {
                                                this.state.listDevices.map(function (device) {
                                                    return <Marker key={device.markerId} isOnline={device.isOnline} name={device.name} address={device.address} phone={device.phone} isFire={device.isFire} lat={device.lat} lng={device.long} />
                                                })
                                            }
                                        </GoogleMap>
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

export default IndexMap;