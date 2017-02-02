import React, { Component } from 'react';
import PageHead from '../PageHead';
import GoogleMap from 'google-map-react';
import Marker from './Marker';
import { Config } from '../../Config';
import io from 'socket.io-client';
import { Modal, Button } from 'react-bootstrap';

let socket = io('http://localhost:8899');

class IndexMap extends Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, isFire: false, lat: 0, long: 0 };
        this.close = this.close.bind(this);
    
    }

    componentDidMount() {
        var self = this;
        socket.on('BackendFireState', function (data) {
            self.setState({ isFire: data.FireState });
            if(data.FireState){
                self.setState({ showModal: true });
            }
        });

        socket.on('DeviceConnected', function (data) {
            self.setState({ isFire: data.isFire, lat: data.Lat, long: data.Long });
            if(data.isFire){
                 self.setState({ showModal: true });
            }
        });

        socket.on('DeviceDisconnected', function (data) {
            self.setState({ isFire: false, lat: 0, long: 0 });
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
                <Modal show={this.state.showModal}  onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cảnh báo cháy</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Tại địa điểm Số 111 Đường ABC XYZ</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>

                {/*<!-- BEGIN PAGE HEAD -->*/}
                <PageHead title="Index Map" subTitle="Show All Fire Places" />
                {/*<!-- END PAGE HEAD -->*/}
                {/*<!-- BEGIN PAGE CONTENT -->*/}
                <div className="page-content">
                    <div className="container">
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
                                            <Marker isFire={this.state.isFire} lat={this.state.lat} lng={this.state.long} />
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