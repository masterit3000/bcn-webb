import React, {Component} from 'react';
import PageHead from '../../PageHead';
import FireHydrantStores from './FireHydrantStores';
import FireHydrantTable from './FireHydrantTable';
import axios from 'axios';

var fireHydrantStores;

class FireHydrant extends Component {
    constructor(props) {
        super(props);
       
        fireHydrantStores = new FireHydrantStores();
    }

    componentDidMount(){
        
    }

    render() {
        return (
               //BEGIN PAGE CONTAINER 
            <div className="page-container">
                <PageHead title="Quản lý" subTitle="Nguồn nước" />
                <div className="page-content">
                    <div className="container-fluid">
                        {/*<!-- BEGIN PAGE CONTENT INNER -->*/}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="portlet light">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="fa fa-tint" aria-hidden="true"></i>
                                            Nguồn nước
							            </div>
                                        <div className="tools">
                                            <a href="#" className="collapse">
                                            </a>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="portlet-body">
                                            <FireHydrantTable store={fireHydrantStores} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<!-- END PAGE CONTENT INNER -->*/}
                    </div>
                </div>

                {/*<!-- END PAGE CONTENT -->*/}
            </div>
        );
    }
}

export default FireHydrant;