import React, { Component } from 'react';
import PageHead from '../PageHead';
import SysLogTable from './SysLogTable';
import { Config } from '../../Config';
import axios from 'axios';
import SysLogInsertModal from './SysLogInsertModal';


class SysLog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInsertModal: false,
            logs: []
        }
    };

    componentDidMount() {

        var self = this;
        var token = localStorage.getItem('token');
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.get('/SysLog/GetSysLog').then(function (response) {
            console.log(response.data.data);
            self.setState({ logs: response.data.data });
        });
    }

    render() {
        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <SysLogInsertModal show={this.state.showInsertModal} />
                <PageHead title="Theo dõi" subTitle="Nhật ký hệ thống" />
                <div className="page-content">
                    <div className="container-fluid">
                        {/*<!-- BEGIN PAGE CONTENT INNER -->*/}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="portlet light">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="fa fa-list-alt" aria-hidden="true"></i>
                                            Nhật ký hệ thống
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="portlet-body">
                                            <SysLogTable logs={this.state.logs} />
                                        </div>
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

export default SysLog;