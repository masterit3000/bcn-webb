import React, { Component } from 'react';
import ListAndroidDevicesTable from './ListAndroidDevicesTable';
import axios from 'axios';
import { Config } from '../../../Config';
import PageHead from '../../PageHead';

class ListAndroidDevices extends Component {

    constructor(props) {
        super(props);
        this.state = { devices: [] };
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        var self = this;
        var token = localStorage.getItem('token');
        var params = new URLSearchParams();

        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });

        instance.post('InitDeviceRoute/GetRegisterDevice', params).then(function (response) {
            console.log(response.data.data);
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
                <PageHead title="Phê duyệt" subTitle="Danh sách điện thoại" />
                <div className="page-content">
                    <div className="container-fluid">
                        {/*<!-- BEGIN PAGE CONTENT INNER -->*/}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="portlet light">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="fa fa-list-alt" aria-hidden="true"></i>
                                            Danh sách điện thoại
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <ListAndroidDevicesTable loadData={this.loadData} devices={this.state.devices} />
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

export default ListAndroidDevices;