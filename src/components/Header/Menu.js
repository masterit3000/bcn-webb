import React, { Component } from 'react';

class Menu extends Component {
    render() {
        return (

            <div className="page-header-menu" >
                <div className="container-fluid">
                    <div className="hor-menu">
                        <ul className="nav navbar-nav">
                            <li>
                                <a href="/">Bản đồ</a>
                            </li>
                            <li>
                                <a href="/FireHistory">Lịch sử báo cháy</a>
                            </li>
                            <li className="menu-dropdown classic-menu-dropdown">
                                <a data-hover="megamenu-dropdown" data-close-others="true" data-toggle="dropdown" href="#">
                                    Quản lý thiết bị <i className="fa fa-angle-down"></i>
                                </a>
                                <ul className="dropdown-menu pull-left">
                                    <li className="dropdown">
                                        <a href="/ListDevices">
                                            <i className="fa fa-fire"></i>&nbsp;
                                            Tủ báo cháy </a>

                                    </li>
                                    <li className="dropdown">
                                        <a href="/ListAndroidDevices">
                                            <i className="fa fa-mobile"></i>&nbsp;
                                            Điện thoại </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="/Area">Quản lý khu vực</a>
                            </li>
                            <li>
                                <a href="/Admins">Danh sách người dùng</a>
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