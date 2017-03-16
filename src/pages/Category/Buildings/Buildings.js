import React, { Component } from 'react';
import PageHead from '../../PageHead';

class Buildings extends Component {
    render() {
        return (
            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <PageHead title="Quản lý" subTitle="Danh sách khu vực" />
                <div className="page-content">
                    <div className="container-fluid">
                        {/*<!-- BEGIN PAGE CONTENT INNER -->*/}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="portlet light">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="fa fa-list-alt" aria-hidden="true"></i>
                                            Dạng kiến trúc công trình
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="portlet-body">
                                            <button onClick={this.onBtnAddClicked} type="button" className="btn btn-primary react-bs-table-add-btn btn-add"><span>
                                                <i className="glyphicon glyphicon-edit"></i>Thêm mới</span>
                                            </button>
                                            <br />
                                            
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

export default Buildings;