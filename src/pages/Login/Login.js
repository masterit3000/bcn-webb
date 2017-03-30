import React, { Component } from 'react';
import './LoginStyleSheet.css';
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
        this.state = {
            isValidated: true, username: '', password: '', errorText: '',
            isShowLoginForm: true, isShowForgetPasswordForm: false,
            isResetPasswordSuccess: false,
            isResetPasswordError: false, resetPasswordText: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
        this.showForgetPasswordForm = this.showForgetPasswordForm.bind(this);
        this.forgetPasswordBackClicked = this.forgetPasswordBackClicked.bind(this);
        this.forgetPasswordClicked = this.forgetPasswordClicked.bind(this);
    }
    forgetPasswordClicked(event) {
        var self = this;
        var json = {}
        json.email = this.state.email;
        var instance = axios.create({
            baseURL: Config.ServiceUrl,
            timeout: Config.RequestTimeOut,
            auth: {
                username: Config.basicAuthUsername,
                password: Config.basicAuthPassword
            }
        });
        instance.post('/Admin/ForgetPassword', json).then(function (response) {
            if (response.data.ResponseCode === 0) {
                self.setState({ isResetPasswordError: true, isResetPasswordSuccess: false, resetPasswordText: response.data.ResponseText });
            } else {
                self.setState({ isResetPasswordError: false, isResetPasswordSuccess: true, resetPasswordText: response.data.ResponseText });
            }
        });
    }
    showForgetPasswordForm(event) {
        this.setState({ isShowForgetPasswordForm: true, isShowLoginForm: false });
    }

    forgetPasswordBackClicked(event) {
        this.setState({ isShowForgetPasswordForm: false, isShowLoginForm: true });
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

        function AlertSuccess(props) {
            const alertSuccessClass = props.isResetPasswordSuccess ? "alert alert-success" : "alert alert-success display-hide";
            return (<div className={alertSuccessClass}>
                <strong>Thành công!</strong> {props.text}
            </div>)
        }

        function AlertFail(props) {
            const alertSuccessClass = props.isResetPasswordError ? "alert alert-warning" : "alert alert-warning display-hide";
            return (<div className={alertSuccessClass}>
                <strong>Lỗi!</strong> {props.text}
            </div>)
        }

        const forgetFormClass = this.state.isShowForgetPasswordForm ? "forget-form" : "forget-form hidden";
        const loginFormClass = this.state.isShowLoginForm ? "login-form" : "login-form hidden";
        return (
            <div className="page-md login login-s">
                <div className="logo">
                    <a href="/Login">
                        <h1>Báo cháy nhanh trực tuyến</h1>
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
                    <form className={loginFormClass}>
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
                                Ấn vào <a href="#" onClick={this.showForgetPasswordForm} id="forget-password">
                                    đây </a>
                                để lấy lại mật khẩu.
			                </p>
                        </div>
                    </form>
                    {/*<!-- END LOGIN FORM -->*/}
                    {/*<!-- BEGIN FORGOT PASSWORD FORM -->*/}
                    <form className={forgetFormClass} >
                        <AlertFail text={this.state.resetPasswordText} isResetPasswordError={this.state.isResetPasswordError} />
                        <AlertSuccess text={this.state.resetPasswordText} isResetPasswordSuccess={this.state.isResetPasswordSuccess} />
                        <h3>Quên mật khẩu ?</h3>
                        <p>
                            Nhập email của bạn tại đây để lấy lại mật khẩu.
                            </p>
                        <div className="form-group">
                            <div className="input-icon">
                                <i className="fa fa-envelope"></i>
                                <input className="form-control placeholder-no-fix" type="text"
                                    autoComplete="off" placeholder="Email" name="email" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" id="back-btn" onClick={this.forgetPasswordBackClicked} className="btn">
                                <i className="m-icon-swapleft"></i> Quay lại </button>
                            <button type="button" onClick={this.forgetPasswordClicked} className="btn green-haze pull-right">
                                Gửi <i className="m-icon-swapright m-icon-white"></i>
                            </button>
                        </div>
                    </form>
                    {/*<!-- END FORGOT PASSWORD FORM -->*/}

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
