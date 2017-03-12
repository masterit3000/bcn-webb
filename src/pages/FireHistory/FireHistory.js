import React, { Component } from 'react';
import PageHead from '../PageHead';
import _ from 'lodash';
import axios from 'axios';
import { Config } from '../../Config';
import FireHistoryTable from './FireHistoryTable';
import FireHistoryChart from './FireHistoryChart';
class FireHistory extends Component {

    constructor(props) {
        super(props);
        this.state = { fireHistoryData: [] };
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        var self = this;
        var token = localStorage.getItem('token');

        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            headers: { 'x-access-token': token }
        });
        instance.get('/FireHistory/GetFireHistory').then(function (response) {
            self.setState({ fireHistoryData: response.data.ResponseText });
        });

    }

    componentWillMount() {
        this.loadData();
    }

    render() {
        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <PageHead title="Lịch sử vụ cháy" subTitle="Thông tin lịch sử vụ cháy" />
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
                                            Chi tiết
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="tabbable-line">
                                            <ul className="nav nav-tabs ">
                                                <li className="active">
                                                    <a href="#tab1" data-toggle="tab">
                                                        Bảng lịch sử </a>
                                                </li>
                                                <li>
                                                    <a href="#tab2" data-toggle="tab">
                                                        Biểu đồ </a>
                                                </li>
                                            </ul>
                                            <div className="tab-content">
                                                <div className="tab-pane active" id="tab1">
                                                    <FireHistoryTable fireHistoryData={this.state.fireHistoryData} />
                                                </div>
                                                <div className="tab-pane" id="tab2">
                                                    <FireHistoryChart />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      
                    </div>
                </div>
            </div>
        );
    }
}

export default FireHistory;