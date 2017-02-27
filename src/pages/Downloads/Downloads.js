import React, { Component } from 'react';
import PageHead from '../PageHead';
import './downloads.css';

class Downloads extends Component {
    render() {
        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <PageHead title="Tài nguyên" subTitle="Danh sách tài nguyên" />
                <div className="page-content">
                    <div className="container-fluid">
                        {/*<!-- BEGIN PAGE CONTENT INNER -->*/}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="portlet light">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="fa fa-list-alt" aria-hidden="true"></i>
                                            Danh sách tài nguyên
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                      <a className="btn btn-success" href="./public/android.apk" >
                                      <i className="fa fa-download" aria-hidden="true"></i>
                                      &nbsp;Tải client Android</a>
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

export default Downloads;