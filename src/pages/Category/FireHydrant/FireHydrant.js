import React, { Component } from 'react';
import PageHead from '../../PageHead';
import axios from 'axios';
import FireHydrantStores from './FireHydrantStores';
import FireHydrantTable from './FireHydrantTable';
import FireHydrantInsertModal from './FireHydrantInsertModal';
import { observer } from 'mobx-react';
import { Config } from '../../../Config';

var fireHydrantStores;

class FireHydrant extends Component {
    constructor(props) {
        super(props);
        fireHydrantStores = new FireHydrantStores();
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
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
        instance.get('/FireHydrant/GetFireHyrant').then(function (response) {
            fireHydrantStores.fireHydrantTableData = response.data.data;
        });
    }

    render() {
        return (
            <div className="page-container">
                <FireHydrantInsertModal show={fireHydrantStores.isShowInsertModal} stores={fireHydrantStores} loadData={this.loadData} />
                <PageHead title="Quản lý" subTitle="Nguồn nước" />
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="portlet light">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="fa fa-tint" aria-hidden="true"></i>
                                            Nguồn nước
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="portlet-body">
                                            <FireHydrantTable stores={fireHydrantStores} />
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

export default observer(FireHydrant);