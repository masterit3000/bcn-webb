import React from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { ListDevicesConst } from './ListDevicesConst';
import axios from 'axios';
import { Config } from '../../../Config';

function nameEditValidator(value) {
    if (!value) {
        return 'Bạn chưa nhập tên!'
    }
    return true;
}

function addressValidator(value) {
    if (!value) {
        return 'Bạn chưa địa chỉ!'
    }
    return true;
}

function onAfterDeleteRow(rowKeys) {

    var obj = Object();
    obj.table = ListDevicesConst.tableName;
    obj.key = ListDevicesConst.keyTableName;
    obj.values = rowKeys;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('Common/DeleteData', obj).then(function (response) {
        console.log(response);
    });
}

function onAfterUpdateCell(row, cellName, cellValue) {

    var obj = Object();
    obj.table = ListDevicesConst.tableName;
    obj.key = ListDevicesConst.keyTableName;
    obj.value = row[ListDevicesConst.keyTableName];
    obj.cellName = cellName;
    obj.cellValue = cellValue;

    var token = localStorage.getItem('token');
    var instance = axios.create({
        baseURL: Config.ServiceUrl,
        timeout: Config.RequestTimeOut,
        headers: { 'x-access-token': token }
    });
    instance.post('Common/UpdateData', obj).then(function (response) {
    });
}

class ListDeviceTable extends React.Component {

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
        var devices = this.props.devices;
        const options = {
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
                data={devices}
                deleteRow={true}
                insertRow={true}
                selectRow={selectRowProp}
                options={options}
                cellEdit={cellEditProp}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn dataField={'markerId'} isKey>
                    Device Id
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='name' editable={{ type: 'text', validator: nameEditValidator }}>
                    Tên tủ báo cháy
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='address' editable={{ type: 'text', validator: addressValidator }}>
                    Địa chỉ
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='phone' editable={{ type: 'text' }}>
                    Số điện thoại
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='imei' editable={{ type: 'text' }}>
                    Mã thiết bị
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='desc' editable={{ type: 'text' }}>
                    Mô tả
                    </TableHeaderColumn>
            </BootstrapTable>

        );
    }
}

export default ListDeviceTable;