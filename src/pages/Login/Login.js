import React, { Component } from 'react';
import LoginStyleSheet from './LoginStyleSheet.css';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import axios from 'axios';
import { Config } from '../../Config';

class LoginContainer extends Component {

    constructor(props) {
        super(props);
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("avatar");
        localStorage.removeItem("memberSince");
        this.state = { isValidated: true, username: '', password: '', errorText: '' };
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }


    handleChange(event) {
        var state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    login(event) {
        event.preventDefault();
        var username = this.state.username;
        var password = this.state.password;
        var isValidated = false;
        var self = this;
        if (_.trim(username).length === 0 || _.trim(password).length === 0) {
            this.setState({ isValidated: false, errorText: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
        } else {
            this.setState({ isValidated: true });
            isValidated = true;
        }
        if (isValidated) {
            // var params = new URLSearchParams();
            // params.append('username', username);
            // params.append('password', password);
            var postJson = { username: username, password: password };
            var instance = axios.create({
                baseURL: Config.ServiceUrl,
                timeout: 10000
            });

            instance.post('/Admin/Login', postJson)
                .then(function (response) {
                    
                    if (response.data.ResponseCode === 1) {
                        //Save jwt to localStorage
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("name", response.data.name);
                        localStorage.setItem("avatar", response.data.avatar);
                        localStorage.setItem("memberSince", response.data.memberSince);
                        browserHistory.push('/');
                    } else {
                        self.setState({ isValidated: false, errorText: 'Sai tên đăng nhập hoặc mật khẩu !' });

                    }

                })
                .catch(function (error) {
                    console.log(error);
                    var errorText = 'Lỗi hệ thống, Không thể đăng nhập vào server!, liên hệ với Admin để được trợ giúp';
                    self.setState({ isValidated: false, errorText: errorText });
                });
        }
    }


    render() {

        function Alert(props) {
            return (
                <div className="alert alert-danger display-hide" style={!props.isValidated ? { display: "block" } : {}}>
                    <button className="close" data-close="alert"></button>
                    <span>{props.errorText}</span>
                </div >
            );
        }

        return (
            <div className="page-md login login-s">
                <div className="logo">
                    <a href="/Login">
                        <h1>PCCC</h1>
                    </a>

                </div>
                {/*<!-- END LOGO -->*/}
                {/*<!-- BEGIN SIDEBAR TOGGLER BUTTON -->*/}
                <div className="menu-toggler sidebar-toggler">
                </div>
                {/*<!-- END SIDEBAR TOGGLER BUTTON -->*/}
                {/*<!-- BEGIN LOGIN -->*/}
                <div className="content content-s">
                    {/*<!-- BEGIN LOGIN FORM -->*/}
                    <form className="login-form">
                        <h3 className="form-title">Đăng nhập</h3>
                        <Alert isValidated={this.state.isValidated} errorText={this.state.errorText} />

                        <div className="form-group">
                            {/*<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->*/}
                            <label className="control-label visible-ie8 visible-ie9">Tên đăng nhập</label>
                            <div className="input-icon">
                                <i className="fa fa-user"></i>
                                <input onChange={this.handleChange} className="form-control placeholder-no-fix" type="text" placeholder="Tên đăng nhập" name="username" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9">Mật khẩu</label>
                            <div className="input-icon">
                                <i className="fa fa-lock"></i>
                                <input onChange={this.handleChange} className="form-control placeholder-no-fix" type="password" placeholder="Mật khẩu" name="password" />
                            </div>
                        </div>
                        <div className="form-actions">
                            <label className="checkbox">
                                <input type="checkbox" name="remember" value="1" /> Ghi nhớ đăng nhập</label>
                            <button type="submit" onClick={this.login} className="btn green-haze pull-right">
                                Đăng nhập <i className="m-icon-swapright m-icon-white"></i>
                            </button>
                        </div>
                        <br /><br />
                        <hr />
                        <div className="forget-password">
                            <h4>Quên mật khẩu ?</h4>
                            <p>
                                Ấn vào <a href="javascript:;" id="forget-password">
                                    đây </a>
                                để lấy lại mật khẩu.
			                </p>
                        </div>

                    </form>
                    {/*<!-- END LOGIN FORM -->*/}
                </div>
                {/*<!-- END LOGIN -->*/}
                {/*<!-- BEGIN COPYRIGHT -->*/}
                <div className="copyright">
                    2017 &copy; PCCC
                </div>
            </div>
        );
    }
}

export default LoginContainer;
