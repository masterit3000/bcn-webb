import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../../Config';
import _ from 'lodash';

//Goi De quy de tao n tang
function GenNested(props) {

    if (_.size(props.areas) > 0) {
        var nest = [];
        _.forEach(props.areas, function (area) {
            if (!area.isdeleted) {
                if (_.size(area.childs) === 0) {
                    nest.push(
                        <li key={area.id} onClick={props.itemClicked} className="dd-item" data-id={area.id} data-status={_.indexOf(props.follows, area.id) >= 0 ? "1" : "0"}>
                            <div className="dd-handle" data-id={area.id} data-status={_.indexOf(props.follows, area.id) >= 0 ? "1" : "0"}>
                                {area.id} - {area.name}
                                {_.indexOf(props.follows, area.id) >= 0
                                    ? <i className="fa fa-check pull-right font-green" data-id={area.id} title="Chọn" aria-hidden="true" ></i> : ""
                                }
                                {/*Follow: {props.follows} ID: {area.id}*/}
                            </div>
                        </li>);
                } else {
                    nest.push(
                        <li key={area.id} onClick={props.itemClicked} className="dd-item" data-id={area.id} data-status={_.indexOf(props.follows, area.id) >= 0 ? "1" : "0"}>
                            <div className="dd-handle" data-id={area.id} data-status={_.indexOf(props.follows, area.id) >= 0 ? "1" : "0"}>
                                {area.id} - {area.name}
                                {_.indexOf(props.follows, area.id) >= 0
                                    ? <i className="fa fa-check pull-right font-green" data-id={area.id} title="Chọn" aria-hidden="true" ></i> : ""
                                }
                            </div>
                            <ol className="dd-list">
                                {/*De quy*/}
                                <GenNested follows={props.follows} areas={area.childs} onBtnAddClicked={props.onBtnAddClicked} onBtnDeleteClicked={props.onBtnDeleteClicked} onBtnEditClicked={props.onBtnEditClicked} />
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
class FollowModalNestedList extends Component {
    constructor(props) {
        super(props);
        this.state = { areas: [] };
        this.itemClicked = this.itemClicked.bind(this);
    }

    itemClicked(e) {
        var id = e.target.getAttribute('data-id');
        var status = e.target.getAttribute('data-status');
        var username = this.props.followId;
        console.log(e.target);

        var self = this;
        var token = localStorage.getItem('token');
        var params = new URLSearchParams();
        params.append('username', username);
        params.append('areaId', id);
        params.append('status', status);
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.post('/Area/SetFollowArea', params).then(function (response) {
            self.loadData();
        });
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
            //Lay ve area theo username
            var username = self.props.followId;

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
            var url = '/Area/GetFollowedAreaByAdminUsername/' + username;
            instance.get(url).then(function (response) {
                self.setState({ follows: response.data.data });
            });
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
                    <GenNested itemClicked={this.itemClicked} areas={this.state.areas} follows={this.state.follows} />
                </ol>
            </div>
        );
    }
}

export default FollowModalNestedList;