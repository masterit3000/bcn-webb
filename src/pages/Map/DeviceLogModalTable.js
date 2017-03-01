import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import moment from 'moment';

function dateFormater(cell, row) {
    moment.locale('vi');

    var fromNow = moment(cell).fromNow();
    return fromNow;
}

class DeviceLogModalTable extends Component {
    render() {
        var logs = this.props.logs;
        return (
            <BootstrapTable
                data={logs}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn hidden dataField='_id' isKey>
                    id
                </TableHeaderColumn>
                <TableHeaderColumn dataField='logType' >
                    Loại
                </TableHeaderColumn>
                <TableHeaderColumn dataField='logDesc'>
                    Mô tả
                </TableHeaderColumn>
                <TableHeaderColumn dataFormat={dateFormater} dataField='logDate'>
                    Ngày
                </TableHeaderColumn>

            </BootstrapTable>
        );
    }
}

export default DeviceLogModalTable;