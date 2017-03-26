import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../Config';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';

//Cac dia diem xung quanh
class MarkerDetailInfoModalTabNearByFireHydrant extends Component {

    constructor(props) {
        super(props);
        this.state = { datas: [] };
    };

    componentWillReceiveProps(props) {
        var self = this;
        var token = localStorage.getItem('token');
        var json = {}
        json.lat = props.lat;
        json.long = props.long;
        json.distance = props.distance;
  //
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });

        instance.post('/FireHydrant/NearByFireHydrant', json).then(function (response) {
            console.log(response.data.data);
            self.setState({ datas: response.data.data });
        });
    }

    render() {
        return (
            <BootstrapTable
                data={this.state.datas}
                deleteRow={false}
                insertRow={false}
                search={true}
                pagination
                striped
                hover>
                <TableHeaderColumn dataField={'_id'} isKey hidden>
                    ID Trụ nước
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='name' >
                    Tên trụ nước
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='address'>
                    Địa chỉ
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='distance'>
                    Khoảng cách
                    </TableHeaderColumn>
                <TableHeaderColumn dataField='desc'>
                    Mô tả
                    </TableHeaderColumn>

            </BootstrapTable>
        );
    }
}

export default MarkerDetailInfoModalTabNearByFireHydrant;