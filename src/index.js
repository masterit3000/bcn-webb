import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import { IntlProvider } from 'react-intl';
import * as generatedMessages from './i18n';
import Login from './pages/Login/Login';

import App from './App';
import IndexMap from './pages/Map/IndexMap';
import ListDevices from './pages/Category/ListDevices/ListDevices';
import Admins from './pages/Category/ManageAdmins/Admins';
import FireHistory from './pages/FireHistory/FireHistory';

ReactDOM.render(
  <IntlProvider locale="vi" messages={generatedMessages.translationMessages.vi}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={IndexMap} />
        <Route path="/ListDevices" component={ListDevices} />
        <Route path="/Admins" component={Admins} />
        <Route path="/FireHistory" component={FireHistory} />
      </Route>
      <Route path="/Login" component={Login}>
      </Route>

    </Router>
  </IntlProvider>,
  document.getElementById('root')
);
