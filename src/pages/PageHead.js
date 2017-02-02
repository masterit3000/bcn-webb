import React, { Component } from 'react';

class PageHead extends Component {
    render() {
        return (
            <div className="page-head">
                <div className="container">
                    {/*<!-- BEGIN PAGE TITLE -->*/}
                    <div className="page-title">
                        <h1>{this.props.title}<small>&nbsp;{this.props.subTitle}</small></h1>
                    </div>
                    {/*<!-- END PAGE TITLE -->*/}
                </div>
            </div>
        );
    }
}

export default PageHead;