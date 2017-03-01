import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { observer } from 'mobx-react';
import mobx from 'mobx';


class TableSMS extends Component {

    constructor(props) {
        super(props);
        this.onAfterUpdateCell = this.onAfterUpdateCell.bind(this);
    };

    handleInsertButtonClick(e) {
        this.props.store.add();
    }

    onAfterUpdateCell(row, cellName, cellValue) {
        this.props.store.update(row, cellName, cellValue);
    }

    createCustomInsertButton = (onClick) => {
        return (
            <InsertButton
                btnText='Thêm'
                btnContextual='btn-primary'
                className='btn-add'
                btnGlyphicon='glyphicon-edit'
                onClick={() => this.handleInsertButtonClick(onClick)} />
        );
    }

    render() {

        const { sms, currentIndex } = this.props.store;
        var smsClone = mobx.toJS(sms);

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
            afterSaveCell: this.onAfterUpdateCell
        };

        return (
            <BootstrapTable
                insertRow={true}
                deleteRow={true}
                data={smsClone}
                selectRow={selectRowProp}
                height='420px'
                cellEdit={cellEditProp}
                options={options}
            >
                <TableHeaderColumn width='20%' dataField='id' isKey>
                    #
                </TableHeaderColumn>
                <TableHeaderColumn width='40%' dataField='phoneNo'>
                    Số di động
                </TableHeaderColumn>
                <TableHeaderColumn width='40%' dataField='name'>
                    Tên người nhận
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default observer(TableSMS);