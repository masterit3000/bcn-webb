import React, { Component } from 'react';
import ReactQuill from 'react-quill';

class TabBaseInformations extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(value) {
        this.props.store.updateThongTinCoSo(value);
    }

    render() {
        var toolbarItems = [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image']
        ];
        return (
            <div>
                <ReactQuill theme="snow"
                    onChange={this.handleChange}
                    modules={{ toolbar: toolbarItems }}
                >
                </ReactQuill>
            </div>
        );

    }
}

export default TabBaseInformations;