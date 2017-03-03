import React, { Component } from 'react';
import PageHead from '../../PageHead';
import NestedList from './NestedList';
import InsertModal from './InsertModal';
import UpdateModal from './UpdateModal';
import AreaStores from './AreaStores';

var areaStores;

class Areas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInsertModal: false,
            showEditModal: false,
            isNewParent: false,
            insertParentId: 0
        };
        areaStores = new AreaStores();
        this.onBtnAddClicked = this.onBtnAddClicked.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
        this.onBtnChildAddClicked = this.onBtnChildAddClicked.bind(this);
        this.onBtnChildEditClicked = this.onBtnChildEditClicked.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
    }

    onBtnAddClicked(e) {
        this.setState({ showInsertModal: true, isNewParent: true });
    }

    onBtnChildAddClicked(id) {
        this.setState({ showInsertModal: true, isNewParent: false, insertParentId: id });
    }

    onBtnChildEditClicked(id, updateName, latitude, longitude) {
        areaStores.update(id, updateName, latitude, longitude);

        this.setState({
            showEditModal: true,
            updateId: id,
            updateName: updateName,
            updateLatitude: latitude,
            updateLongitude: longitude
        });
    }

    closeInsertModal() {
        this.setState({ showInsertModal: false });
        this.refs.nestList.loadData();
    }

    closeUpdateModal() {
        this.setState({ showEditModal: false });
        this.refs.nestList.loadData();
    }

    render() {
        return (

            //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <UpdateModal title="Sửa khu vực" show={this.state.showEditModal} stores={areaStores} updateId={this.state.updateId} updateName={this.state.updateName} updateLatitude={this.state.updateLatitude} updateLongitude={this.state.updateLongitude} onHide={this.closeUpdateModal} />
                <InsertModal title="Thêm mới khu vực" show={this.state.showInsertModal} isNewParent={this.state.isNewParent} onHide={this.closeInsertModal} parentId={this.state.insertParentId} />
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
                                            Danh sách khu vực
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="portlet-body">
                                            <button onClick={this.onBtnAddClicked} type="button" className="btn btn-primary react-bs-table-add-btn btn-add"><span>
                                                <i className="glyphicon glyphicon-edit"></i>&nbsp;Thêm mới khu vực cha</span>
                                            </button>
                                            &nbsp;<br />&nbsp;
                                            <NestedList ref="nestList" onBtnChildEditClicked={this.onBtnChildEditClicked} onBtnChildAddClicked={this.onBtnChildAddClicked} />
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

export default Areas;