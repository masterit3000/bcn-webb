import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { observer } from 'mobx-react';
import mobx from 'mobx';

function onAfterDeleteRow(rowKeys) {

    alert('The rowkey you drop: ' + rowKeys);
}
function onAfterUpdateCell(row, cellName, cellValue) {

}
class FireHydrantTable extends Component {
    render() {
        const options = {
            deleteText: 'Xóa',
            insertBtn: this.createCustomInsertButton,
            afterDeleteRow: onAfterDeleteRow
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
                data={this.props.store.fireHydrantTableData}
                deleteRow={true}
                insertRow={true}
                selectRow={selectRowProp}
                options={options}
                cellEdit={cellEditProp}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn dataField={'fireHydrantId'} isKey>
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
            </BootstrapTable>
        );
    }
}

export default observer(FireHydrantTable);