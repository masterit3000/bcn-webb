import React, { Component } from 'react';
import PageHead from '../../PageHead';
import axios from 'axios';
import { Config } from '../../../Config';
import ListDevicesCss from './ListDevices.css';
import { ListDevicesConst } from './ListDevicesConst';
import ListDeviceTable from './ListDeviceTable';
import InsertModal from './InsertModal';

class ListDevices extends Component {
    constructor() {
        super();
        this.state = { devices: [], isShowInsertModal: false };
        this.showInsertModal = this.showInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    showInsertModal() {
        this.setState({ isShowInsertModal: true });
    }

    closeInsertModal() {
        this.setState({ isShowInsertModal: false });
    }

    loadData() {
        var self = this;
        var token = localStorage.getItem('token');
        var params = new URLSearchParams();

        params.append('table', ListDevicesConst.tableName);
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            headers: { 'x-access-token': token }
        });
        instance.post('Common/GetData', params).then(function (response) {
            self.setState({ devices: response.data.data });
        });
    }

    componentWillMount() {
        this.loadData();
    }

    render() {

        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <InsertModal show={this.state.isShowInsertModal} onHide={this.closeInsertModal} loadData={this.loadData} />
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