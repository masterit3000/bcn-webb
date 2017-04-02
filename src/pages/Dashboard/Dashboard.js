import React, { Component } from 'react';
import PageHead from '../PageHead';

class Dashboard extends Component {
    render() {
        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <PageHead title="Trang chủ" subTitle="Dash board" />
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
                                            Trang chủ
                                        <div className="tools">
                                                <a href="#" className="collapse">
                                                </a>
                                            </div>
                                        </div>
                                        <div className="portlet-body">

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

export default Dashboard;