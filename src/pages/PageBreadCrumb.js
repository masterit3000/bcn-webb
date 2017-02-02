import React, { Component } from 'react';

class PageBreadCrumb extends Component {
    render() {
        return (
            <ul className="page-breadcrumb breadcrumb">
                <li>
                    <a href="#">Home</a><i className="fa fa-circle"></i>
                </li>
                <li>
                    <a href="layout_blank_page.html">Features</a>
                    <i className="fa fa-circle"></i>
                </li>
                <li className="active">
                    Blank Page Layout
				        </li>
            </ul>
        );
    }
}

export default PageBreadCrumb;