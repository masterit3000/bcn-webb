import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './FireHistoryChart.css';
import axios from 'axios';
import { Config } from '../../Config';


class FireHistoryChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
            
            ]
        };
        this.fromDateChanged = this.fromDateChanged.bind(this);
        this.toDateChanged = this.toDateChanged.bind(this);
        this.fromDateFocusChanged = this.fromDateFocusChanged.bind(this);
        this.toDateFocusChanged = this.toDateFocusChanged.bind(this);
        this.btnChartClicked = this.btnChartClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    fromDateChanged(date) {
        this.setState({ fromDate: date });
    }

    toDateChanged(date) {
        this.setState({ toDate: date });
    }

    fromDateFocusChanged({ focused }) {
        this.setState({ focusedFromDate: focused });
    }

    toDateFocusChanged({ focused }) {
        this.setState({ focusedToDate: focused });
    }

    btnChartClicked(e) {
        var self = this;

        const fromDate = this.state.fromDate.format("DD/MM/YYYY");
        const toDate = this.state.toDate.format("DD/MM/YYYY");

        var token = localStorage.getItem('token');
        var json = {}
        json.fromDate = fromDate;
        json.toDate = toDate;

        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            },
            headers: { 'x-access-token': token }
        });
        instance.post('/FireHistory/GetFireHistoryByDate', json).then(function (response) {
            console.log(response.data.data);
            self.setState({ data: response.data.data });
        });
    }

    handleChange(e) {
    }

    render() {
        return (
            <div>
                <b>Chọn ngày:</b> &nbsp;&nbsp;&nbsp;
                <SingleDatePicker
                    id="fromDate"
                    isOutsideRange={() => false}
                    date={this.state.fromDate}
                    focused={this.state.focusedFromDate}
                    onDateChange={this.fromDateChanged}
                    onFocusChange={this.fromDateFocusChanged}
                    showClearDate
                    placeholder="Từ ngày"
                />&nbsp;
                <SingleDatePicker
                    id="toDate"
                    isOutsideRange={() => false}
                    date={this.state.toDate}
                    focused={this.state.focusedToDate}
                    onDateChange={this.toDateChanged}
                    onFocusChange={this.toDateFocusChanged}
                    showClearDate
                    placeholder="Đến ngày"
                />
                &nbsp;&nbsp;&nbsp;
                <button onClick={this.btnChartClicked} className="btn btn-success">
                    Xác nhận
                </button>
                <hr />
                <BarChart data={this.state.data} width={1000} height={500}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Tổng số vụ cháy" label fill="#8884d8" />
                </BarChart>
            </div>

        );
    }
}

export default FireHistoryChart;