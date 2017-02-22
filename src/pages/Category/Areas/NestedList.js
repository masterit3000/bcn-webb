import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../../Config';
import './NestedList.css';
import _ from 'lodash';

//Goi De quy de tao n tang
function GenNested(props) {

    if (_.size(props.areas) > 0) {
        var nest = [];
        _.forEach(props.areas, function (area) {
            if (!area.isdeleted) {
                if (_.size(area.childs) === 0) {
                    nest.push(
                        <li key={area.id} className="dd-item" data-id={area.id}>
                            <div className="dd-handle">
                                {area.id} - {area.name}
                                <i className="fa fa-times pull-right font-red" data-id={area.id} title="Xóa" aria-hidden="true" onClick={props.onBtnDeleteClicked}></i>
                                <i className="fa fa-pencil pull-right font-grey-gallery" data-id={area.id} data-name={area.name} title="Sửa" aria-hidden="true" onClick={props.onBtnEditClicked}></i>
                                <i className="fa fa-plus pull-right font-blue" data-id={area.id} title="Thêm mới" aria-hidden="true" onClick={props.onBtnAddClicked}></i>
                            </div>
                        </li>);
                } else {
                    nest.push(
                        <li key={area.id} className="dd-item" data-id={area.id}>
                            <div className="dd-handle">
                                {area.id} - {area.name}
                                <i className="fa fa-times pull-right font-red" data-id={area.id} title="Xóa" aria-hidden="true" onClick={props.onBtnDeleteClicked}></i>
                                <i className="fa fa-pencil pull-right font-grey-gallery" data-id={area.id} data-name={area.name} title="Sửa" aria-hidden="true" onClick={props.onBtnEditClicked}></i>
                                <i className="fa fa-plus pull-right font-blue" data-id={area.id} title="Thêm mới" aria-hidden="true" onClick={props.onBtnAddClicked}></i>
                            </div>
                            <ol className="dd-list">
                                {/*De quy*/}
                                <GenNested areas={area.childs} onBtnAddClicked={props.onBtnAddClicked} onBtnDeleteClicked={props.onBtnDeleteClicked} onBtnEditClicked={props.onBtnEditClicked} />
                            </ol>
                        </li>
                    );
                }
            }
        });
        return <div>{nest}</div>;
    } else {
        return <div>Không có dữ liệu</div>;
    }
}

class NestedList extends Component {

    constructor(props) {
        super(props);
        this.state = { areas: [] };
        this.onBtnAddClicked = this.onBtnAddClicked.bind(this);
        this.onBtnDeleteClicked = this.onBtnDeleteClicked.bind(this);
        this.onBtnEditClicked = this.onBtnEditClicked.bind(this);
    }

    onBtnAddClicked(e) {
        var id = e.target.getAttribute('data-id');
        this.props.onBtnChildAddClicked(id);
    }

    onBtnEditClicked(e) {
        var id = e.target.getAttribute('data-id');
        var name = e.target.getAttribute('data-name');
        this.props.onBtnChildEditClicked(id, name);
    }

    onBtnDeleteClicked(e) {
        var id = e.target.getAttribute('data-id');
        if (confirm('Xóa khu vực này ? Việc xóa có thể gây ảnh hưởng tới khả năng vận hành của hệ thống')) {
            var self = this;
            var token = localStorage.getItem('token');
            var params = new URLSearchParams();
            params.append('id', id);
            var instance = axios.create({
                baseURL: Config.ServiceUrl,
                timeout: Config.RequestTimeOut,
                auth: {
                    username: Config.basicAuthUsername,
                    password: Config.basicAuthPassword
                },
                headers: { 'x-access-token': token }
            });
            instance.post('Area/DeleteArea', params).then(function (response) {
                self.loadData();
            });
        }
    }

    loadData() {
        var self = this;
        var token = localStorage.getItem('token');

        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });

        instance.get('Area/ListAreas').then(function (response) {
            self.setState({ areas: response.data.data });
        });
    }

    componentWillMount() {
        this.loadData();
    }

    render() {

        return (
            <div className="dd" id="nestable_list_1">
                <ol className="dd-list">
                    <GenNested areas={this.state.areas} onBtnAddClicked={this.onBtnAddClicked} onBtnDeleteClicked={this.onBtnDeleteClicked} onBtnEditClicked={this.onBtnEditClicked} />
                </ol>
            </div>
        );
    }
}

export default NestedList;