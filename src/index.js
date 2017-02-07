import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import { IntlProvider } from 'react-intl';
import * as generatedMessages from './i18n';
import Login from './pages/Login/Login';

import App from './App';
import IndexMap from './pages/Map/IndexMap';
import ListDevices from './pages/Category/ListDevices';

ReactDOM.render(
  <IntlProvider locale="vi" messages={generatedMessages.translationMessages.vi}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={IndexMap} />
        <Route path="/ListDevices" component={ListDevices} />
      </Route>
      <Route path="/Login" component={Login}>
      </Route>
      
    </Router>
  </IntlProvider>,
  document.getElementById('root')
);
