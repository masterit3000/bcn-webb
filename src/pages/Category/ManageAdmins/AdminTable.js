import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import axios from 'axios';
import { Config } from '../../../Config';

const tableName = 'admins';
const keyTableName = 'userId';

function imageFormatter(cell, row) {
    return "<img class='img-circle' style='width:25px; height:25px;' src='" + cell + "'/>";
}

// validator function pass the user input value and should return true|false.
function nameEditValidator(value) {
    if (!value) {
        return 'Bạn chưa nhập tên!'
    }
    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// validator function pass the user input value and should return true|false.
function emailEditValidator(value) {
    if (!value) {
        return 'Bạn chưa nhập email!';
    } else if (!validateEmail(value)) {
        return 'Sai định dạng email!';
    }
    return true;
}

function onAfterDeleteRow(rowKeys) {

    var obj = Object();
    obj.table = tableName;
    obj.key = keyTableName;
    obj.values = rowKeys;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('/Common/DeleteData', obj).then(function (response) {
        console.log(response);
    });
}

function onAfterUpdateCell(row, cellName, cellValue) {
    var obj = Object();
    obj.table = tableName;
    obj.key = keyTableName;
    obj.value = row[keyTableName];
    obj.cellName = cellName;
    obj.cellValue = cellValue;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('/Common/UpdateData', obj).then(function (response) {
    });
}
class AdminTable extends Component {
    onClickProductSelected(cell, row, rowIndex) {
        this.props.showFollowModal(cell);
    }

    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <button
                className="btn btn-primary"
                type="button"
                onClick={() =>
                    this.onClickProductSelected(cell, row, rowIndex)}
            >
                Theo dõi
            </button>
        )
    }

    handleInsertButtonClick = (onClick) => {
        // Custom your onClick event here,
        // it's not necessary to implement this function if you have no any process before onClick
        this.props.showInsertModal();
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

    render() {
        var products = this.props.products;
        const options = {
            afterDeleteRow: onAfterDeleteRow,
            deleteText: 'Xóa',
            insertBtn: this.createCustomInsertButton
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

            <BootstrapTable
                data={products}
                deleteRow={true}
                insertRow={true}
                selectRow={selectRowProp}
                options={options}
                cellEdit={cellEditProp}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn dataField='avatar'
                    dataFormat={imageFormatter}>
                    Ảnh đại diện
                    </TableHeaderColumn>
                <TableHeaderColumn dataField={keyTableName} isKey>
                    Mã Admin
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='name' editable={{ type: 'text', validator: nameEditValidator }}>
                    Tên
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='email' editable={{ type: 'text', validator: emailEditValidator }}>
                    Email
                    </TableHeaderColumn>
                <TableHeaderColumn dataField={keyTableName} dataFormat={this.cellButton.bind(this)}>
                    Khu vực theo dõi
                    </TableHeaderColumn>
            </BootstrapTable>

        );
    }
}
export default AdminTable;