import React, { Component } from 'react';
import { Link } from 'react-router';
import './menu.css';
class Menu extends Component {
    render() {
        return (

            <div className="page-header-menu" >
                <div className="container-fluid">
                    <div className="hor-menu">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/">Bản đồ</Link>
                            </li>
                            <li>
                                <Link to="/FireHistory">Lịch sử báo cháy</Link>
                            </li>
                            <li className="menu-dropdown classic-menu-dropdown">
                                <a data-hover="megamenu-dropdown" data-close-others="true" data-toggle="dropdown" href="#">
                                    Quản lý thiết bị <i className="fa fa-angle-down"></i>
                                </a>
                                <ul className="dropdown-menu pull-left">
                                    <li className="dropdown">
                                        <Link to="/ListDevices">
                                            <i className="fa fa-fire"></i>&nbsp;
                                                Tủ báo cháy
                                            </Link>
                                    </li>
                                    <li className="dropdown">
                                        <Link to="/ListAndroidDevices">

                                            <i className="fa fa-mobile"></i>&nbsp;
                                            Điện thoại
                                             </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/Area">
                                    Quản lý khu vực
                                </Link>
                            </li>
                            <li>
                                <Link to="/Admins">
                                    Danh sách người dùng
                                </Link>
                            </li>
                            <li>
                                <Link to="/Admins">
                                    Nhật ký hệ thống
                                </Link>
                            </li>
                            <li className="right-align-menu">
                                <Link to="/Downloads">
                                    Tài nguyên
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/*<!-- END MEGA MENU -->*/}
                </div >
            </div >

        );
    }
}

export default Menu;