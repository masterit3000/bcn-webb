import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { defineMessages, IntlProvider , FormattedMessage} from 'react-intl';
import * as generatedMessages from './i18n'

const messages = defineMessages({
  hi: {
    id: 'Hello',
    defaultMessage: 'Start your next react project in seconds',
  }
});

class App extends Component {
  render() {
    return (
      <IntlProvider locale="vi" messages={generatedMessages.translationMessages.vi}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
           <FormattedMessage {...messages.hi} />
        </p>
        </div>
      </IntlProvider>
    );
  }
}

export default App;
