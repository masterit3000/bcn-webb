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
                                <i className="fa fa-pencil pull-right font-grey-gallery" data-id={area.id} data-name={area.name} data-latitude={area.latitude} data-longitude={area.longitude} title="Sửa" aria-hidden="true" onClick={props.onBtnEditClicked}></i>
                                <i className="fa fa-plus pull-right font-blue" data-id={area.id} title="Thêm mới" aria-hidden="true" onClick={props.onBtnAddClicked}></i>
                            </div>
                        </li>);
                } else {
                    nest.push(
                        <li key={area.id} className="dd-item" data-id={area.id}>
                            <button type="button" data-action="collapse" data-id={area.id} onClick={props.onBtnCollapseClicked}
                                style={area.expand == null || area.expand === false ? { display: 'none' } : { display: 'block' }}>Collapse</button>
                            <button type="button" data-action="expand" data-id={area.id} onClick={props.onBtnExpandClicked}
                                style={area.expand == null || area.expand === false ? { display: 'block' } : { display: 'none' }}>Expand</button>
                            <div className="dd-handle">
                                {area.id} - {area.name}
                                <i className="fa fa-times pull-right font-red" data-id={area.id} title="Xóa" aria-hidden="true" onClick={props.onBtnDeleteClicked}></i>
                                <i className="fa fa-pencil pull-right font-grey-gallery" data-id={area.id} data-name={area.name} data-latitude={area.latitude} data-longitude={area.longitude} title="Sửa" aria-hidden="true" onClick={props.onBtnEditClicked}></i>
                                <i className="fa fa-plus pull-right font-blue" data-id={area.id} title="Thêm mới" aria-hidden="true" onClick={props.onBtnAddClicked}></i>
                            </div>
                            <ol className="dd-list" data-parentid={area.id}
                                style={area.expand == null || area.expand === false ? { display: 'none' } : { display: 'block' }}>
                                {/*De quy*/}
                                <GenNested areas={area.childs} onBtnAddClicked={props.onBtnAddClicked} onBtnDeleteClicked={props.onBtnDeleteClicked} onBtnEditClicked={props.onBtnEditClicked} onBtnExpandClicked={props.onBtnExpandClicked} onBtnCollapseClicked={props.onBtnCollapseClicked} />
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

function findParentLevelForUpdate(areas, id, lastNode, expand) {
    _.forEach(areas, function (area) {
        if (_.isEqual(area.id, id)) {
            area.expand = expand;

        } else {
            if (_.size(area.childs) > 0) {
                findParentLevelForUpdate(area.childs, id, area, expand);
            }
        }
    });
}

class NestedList extends Component {

    constructor(props) {
        super(props);
        this.state = { areas: [] };
        this.onBtnAddClicked = this.onBtnAddClicked.bind(this);
        this.onBtnDeleteClicked = this.onBtnDeleteClicked.bind(this);
        this.onBtnEditClicked = this.onBtnEditClicked.bind(this);
        this.onBtnExpandClicked = this.onBtnExpandClicked.bind(this);
        this.onBtnCollapseClicked = this.onBtnCollapseClicked.bind(this);
    }

    onBtnAddClicked(e) {
        var id = e.target.getAttribute('data-id');
        this.props.onBtnChildAddClicked(id);
    }

    onBtnEditClicked(e) {
        var id = e.target.getAttribute('data-id');
        var name = e.target.getAttribute('data-name');
        var latitude = e.target.getAttribute('data-latitude');
        var longitude = e.target.getAttribute('data-longitude');

        this.props.onBtnChildEditClicked(id, name, latitude, longitude);
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

    //When btn expand on nested list clicked
    onBtnExpandClicked(e) {
        var id = e.target.getAttribute('data-id');
        findParentLevelForUpdate(this.state.areas, id, {}, true);
        this.setState({ areas: this.state.areas });
    }

    onBtnCollapseClicked(e) {
        var id = e.target.getAttribute('data-id');
        findParentLevelForUpdate(this.state.areas, id, {}, false);
        this.setState({ areas: this.state.areas });
    }

    render() {

        return (
            <div className="dd" id="nestable_list_1">
                <ol className="dd-list">
                    <GenNested areas={this.state.areas} onBtnAddClicked={this.onBtnAddClicked} onBtnDeleteClicked={this.onBtnDeleteClicked} onBtnEditClicked={this.onBtnEditClicked} onBtnExpandClicked={this.onBtnExpandClicked} onBtnCollapseClicked={this.onBtnCollapseClicked} />
                </ol>
            </div>
        );
    }
}

export default NestedList;