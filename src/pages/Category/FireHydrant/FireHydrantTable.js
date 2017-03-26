import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { observer } from 'mobx-react';
import mobx from 'mobx';
import axios from 'axios';
import { Config } from '../../../Config';
import FireHydrantUpdateModal from './FireHydrantUpdateModal';

function onAfterDeleteRow(rowKeys) {
    var obj = Object();
    obj.table = 'firehydrants';
    obj.values = rowKeys;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('/Common/DeleteDataById', obj).then(function (response) {

    });
}

function onAfterUpdateCell(row, cellName, cellValue) {
    var cloneRow = mobx.toJS(row);
    var obj = Object();
    obj.table = 'firehydrants';
    obj.value = cloneRow._id;
    obj.cellName = cellName;
    obj.cellValue = cellValue;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('/Common/UpdateDataById', obj).then(function (response) {
    });
}

class FireHydrantTable extends Component {

    constructor(props) {
        super(props);
    };

    handleInsertButtonClick = (onClick) => {
        this.props.stores.isShowInsertModal = true;
    }

    createCustomInsertButton = (onClick) => {
        return (
            <InsertButton
                btnText='Thêm mới'
                btnContextual='btn-primary'
                className='btn-add'
                btnGlyphicon='glyphicon-edit'
                onClick={() => this.handleInsertButtonClick(onClick)} />
        );
    }

    onEdit(cell, row, rowIndex) {
        this.props.stores.isShowUpdateModal = true;
        this.props.stores.updateData = row;
    }

    editButton(cell, row, enumObject, rowIndex) {
        return (
            <button
                className="btn btn-primary"
                type="button"
                onClick={() =>
                    this.onEdit(cell, row, rowIndex)}
            >
                Sửa
            </button>
        )
    }


    render() {
        const options = {
            deleteText: 'Xóa',
            insertBtn: this.createCustomInsertButton,
            afterDeleteRow: onAfterDeleteRow,
        };

        const selectRowProp = {
            mode: 'checkbox'
        };

        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: onAfterUpdateCell
        };
        return (
            <div>
                <FireHydrantUpdateModal show={this.props.stores.isShowUpdateModal} stores={this.props.stores} loadData={this.props.loadData} />

                <BootstrapTable
                    data={this.props.stores.fireHydrantTableData}
                    deleteRow={true}
                    insertRow={true}
                    selectRow={selectRowProp}
                    options={options}
                    cellEdit={cellEditProp}
                    search={true}
                    pagination
                    striped
                    hover>
                    <TableHeaderColumn dataField={'_id'} isKey hidden>
                        ID Trụ nước
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='name' editable={{ type: 'text' }}>
                        Tên trụ nước
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='address' editable={{ type: 'text' }}>
                        Địa chỉ
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='desc' editable={{ type: 'text' }}>
                        Mô tả
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField={'_id'} dataFormat={this.editButton.bind(this)} >
                        Chỉnh sửa
                </TableHeaderColumn>
                </BootstrapTable>
            </div>

        );
    }
}

export default observer(FireHydrantTable);