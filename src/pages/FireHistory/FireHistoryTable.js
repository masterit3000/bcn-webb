import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import moment from 'moment';
import axios from 'axios';
import { Config } from '../../Config';

function dateFormat(cell, row) {
    moment.locale('vi');
    var m = moment(cell);
    return m.fromNow() + "<br />" + m.format("DD/MM/YYYY, hh:mm:ss") + ")";
}


function onAfterUpdateCell(row, cellName, cellValue) {
    var obj = Object();
    obj.table = 'firehistories';
    obj.value = row['_id'];
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
const cellEditProp = {
    mode: 'click',
    blurToSave: true,
    afterSaveCell: onAfterUpdateCell
};
class FireHistoryTable extends Component {

    render() {
        var fireHistoryData = this.props.fireHistoryData;

        return (

            <BootstrapTable
                data={fireHistoryData}
                search={true}
                pagination
                striped
                cellEdit={cellEditProp}
                hover>
                <TableHeaderColumn dataField='fireDate' dataFormat={dateFormat} >
                    Thời gian
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='markerId' >
                    id
                    </TableHeaderColumn>
                <TableHeaderColumn hidden dataField='_id' isKey >
                    id
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='name' >
                    Tên
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='address' >
                    Địa chỉ
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='phone' >
                    Điện thoại
                    </TableHeaderColumn>

                <TableHeaderColumn dataField='note' editable={{ type: 'text' }}>
                    Ghi chú
                    </TableHeaderColumn>
            </BootstrapTable>

        );
    }
}

export default FireHistoryTable;