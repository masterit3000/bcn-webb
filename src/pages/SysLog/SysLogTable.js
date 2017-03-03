import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import moment from 'moment';

function onAfterDeleteRow(rowKeys) {
    console.log('delete');
    // var obj = Object();
    // obj.table = tableName;
    // obj.key = keyTableName;
    // obj.values = rowKeys;

    // var token = localStorage.getItem('token');
    // var instance = axios.create({
    //     baseURL: Config.apiUrl,
    //     timeout: Config.RequestTimeOut,
    //     headers: { 'x-access-token': token }
    // });
    // instance.post('/Common/DeleteData', obj).then(function (response) {
    //     console.log(response);
    // });
}


function onAfterUpdateCell(row, cellName, cellValue) {
    console.log('on after update');
    // var obj = Object();
    // obj.table = tableName;
    // obj.key = keyTableName;
    // obj.value = row[keyTableName];
    // obj.cellName = cellName;
    // obj.cellValue = cellValue;

    // var token = localStorage.getItem('token');
    // var instance = axios.create({
    //     baseURL: Config.ServiceUrl,
    //     timeout: Config.RequestTimeOut,
    //     headers: { 'x-access-token': token }
    // });
    // instance.post('/Common/UpdateData', obj).then(function (response) {
    // });
}

function dateFormatter(cell, row) {
    moment.locale('vi');
    var formatDate = moment(cell).format("DD/MM/YYYY, hh:mm:ss") + ' - ' + moment(cell).fromNow();
    return formatDate;
}

class SysLogTable extends Component {

    constructor(props) {
        super(props);
        this.createCustomInsertButton = this.createCustomInsertButton.bind(this);
    };

    handleInsertButtonClick = (onClick) => {
        // Custom your onClick event here,
        // it's not necessary to implement this function if you have no any process before onClick
        console.log('insert btn clicked');
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

        var logs = this.props.logs;

        const selectRowProp = {
            mode: 'checkbox'
        };
        const options = {
            afterDeleteRow: onAfterDeleteRow,
            deleteText: 'Xóa',
            insertBtn: this.createCustomInsertButton
        };
        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: onAfterUpdateCell
        };
        return (
            <BootstrapTable
                data={logs}
                deleteRow={true}
                insertRow={true}
                selectRow={selectRowProp}
                options={options}
                cellEdit={cellEditProp}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn hidden dataField='_id' isKey>
                    ID
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='type'>
                    Mã Admin
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='desc'>
                    Mô tả
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='date' dataFormat={dateFormatter}>
                    Ngày
                    </TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default SysLogTable;