import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { observer } from 'mobx-react';

class TableSMS extends Component {

    constructor(props) {
        super(props);
        this.state = { sms: [], currentIndex: 1 };
    };

    handleInsertButtonClick(e) {
        var arr = this.state.sms;
        var currentIndex = this.state.currentIndex;
        var newRow = { id: currentIndex, phoneNo: "", name: "" };
        arr.push(newRow);
        this.setState({ sms: arr });
        var nextIndex = currentIndex + 1;
        this.setState({ currentIndex: nextIndex });
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
        const { todos } = this.props.store;


        const options = {
            deleteText: 'Xóa',
            insertBtn: this.createCustomInsertButton
        };

        const selectRowProp = {
            mode: 'checkbox'
        };

        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        };

        return (
            <BootstrapTable
                insertRow={true}
                deleteRow={true}
                data={this.state.sms}
                selectRow={selectRowProp}
                height='420'
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

export default TableSMS;