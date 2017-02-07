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
                                <a href="/ListDevices">Danh sách tủ báo cháy</a>
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