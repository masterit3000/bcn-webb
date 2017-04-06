import React, { Component } from 'react';
import './todo.css';

const NotificationSideBar = (props) => {

    return (
        <div className="scroller" style={{ maxHeight: '800px' }} data-always-visible="0" data-rail-visible="0" data-handle-color="#dae3e7">
            <div className="todo-tasklist">
                <div className="todo-tasklist-item todo-tasklist-item-border-red">
                    
                    <div className="todo-tasklist-item-title">
                        Cảnh báo cháy
													</div>
                    <div className="todo-tasklist-item-text">
                        Hồ gươm
													</div>
                    <div className="todo-tasklist-controls pull-left">
                        <span className="todo-tasklist-date"><i className="fa fa-calendar"></i> 03/04/2017 13:01:33 </span>
                        <span className="todo-tasklist-badge badge badge-roundless bg-red-flamingo">Cảnh báo cháy</span>
                    </div>
                </div>
                <div className="todo-tasklist-item todo-tasklist-item-border-green">
                    <div className="todo-tasklist-item-title">
                        Rút sạc
					</div>
                    <div className="todo-tasklist-item-text">
                        Cảnh báo dây sạc đã bị rút
					</div>
                    <div className="todo-tasklist-controls pull-left">
                        <span className="todo-tasklist-date"><i className="fa fa-calendar"></i> 03/04/2017 09:01:33 </span>
                        <span className="todo-tasklist-badge badge badge-roundless">Rút sạc</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSideBar;