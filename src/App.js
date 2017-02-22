import React, { Component } from 'react';
// import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Header from './components/Header/Header'

// const messages = defineMessages({
//   hi: {
//     id: 'Hello',
//     defaultMessage: 'Start your next react project in seconds',
//   }
// });

class App extends Component {

  render() {
    // const {formatMessage} = this.props.intl;

    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

// App.propTypes = {
//   intl: intlShape.isRequired
// }

// export default injectIntl(App);
export default App;