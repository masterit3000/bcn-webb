import React, { Component } from 'react';
import PageHead from '../PageHead';
import './account.css';
import { Link } from 'react-router';
class Account extends Component {

    render() {
        var avatar = localStorage.getItem('avatar');
        var name = localStorage.getItem('name');

        return (
            <div className="page-container">
                <PageHead title="Quản lý" subTitle="Tài khoản" />
                <div className="page-content">
                    <div className="container-fluid">

                        <div className="row">
                            <div className="profile-sidebar">
                                <div className="col-md-3">
                                    <div className="portlet light profile-sidebar-portlet">
                                        <div className="profile-userpic">
                                            <img src={avatar}
                                                className="img-responsive" alt="" />
                                        </div>
                                        <div className="profile-usertitle">
                                            <div className="profile-usertitle-name">
                                                {name}
                                            </div>
                                            <div className="profile-usertitle-job">
                                                PCCC
								        </div>
                                        </div>
                                        {/*<div className="profile-userbuttons">
                                        <button type="button" className="btn btn-circle green-haze btn-sm">Follow</button>
                                        <button type="button" className="btn btn-circle btn-danger btn-sm">Message</button>
                                    </div>*/}
                                        <div className="profile-usermenu">
                                            <ul className="nav">
                                                <li>
                                                    <Link to="/ManageAccount">
                                                        <i className="fa fa-user"></i>
                                                        Thông tin cá nhân
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/Account/ChangePassword">
                                                        <i className="fa fa-key"></i>
                                                        Thay đổi mật khẩu
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-content col-md-9">
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Account;