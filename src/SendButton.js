import React, {Component, PropTypes} from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';

const messages = defineMessages({
    hi: {
        id: 'Hello',
        defaultMessage: 'Send',
    }
});

class SendButton extends Component {
    render() {
        const {formatMessage} = this.props.intl;

        return (
            <button 
                onClick={this.props.onClick}
                title={formatMessage(messages.hi)}
            >
                <FormattedMessage {...messages.hi} />
            </button>
        );
    }
}

SendButton.propTypes = {
    intl   : intlShape.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default injectIntl(SendButton);