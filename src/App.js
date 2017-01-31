import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import SendButton from './SendButton';

const messages = defineMessages({
  hi: {
    id: 'Hello',
    defaultMessage: 'Start your next react project in seconds',
  }
});

class App extends Component {
  
  render() {
    const {formatMessage} = this.props.intl;
    
    return (
     
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            <FormattedMessage {...messages.hi} />
            <input type="text" placeholder={formatMessage(messages.hi)} />
          </p>
        </div>
    
    );
  }
}
App.propTypes = {
    intl   : intlShape.isRequired
};

export default injectIntl(App);
