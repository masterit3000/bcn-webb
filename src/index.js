import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { IntlProvider } from 'react-intl';
import * as generatedMessages from './i18n';
import Login from './pages/Login/Login';

import App from './App';
import IndexMap from './pages/Map/IndexMap';
import ListDevices from './pages/Category/ListDevices/ListDevices';
import Admins from './pages/Category/ManageAdmins/Admins';
import FireHistory from './pages/FireHistory/FireHistory';
import ListAndroidDevices from './pages/Category/ListAndroidDevices/ListAndroidDevices';
import Areas from './pages/Category/Areas/Areas';
import Downloads from './pages/Downloads/Downloads';
import SysLog from './pages/SysLog/SysLog';
import Account from './pages/Account/Account';
import ChangePassword from './pages/Account/ChangePassword';
import Buildings from './pages/Category/Buildings/Buildings';

ReactDOM.render(
  <IntlProvider locale="vi" messages={generatedMessages.translationMessages.vi}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={IndexMap} />
        <Route path="/ListDevices" component={ListDevices} />
        <Route path="/Admins" component={Admins} />
        <Route path="/FireHistory" component={FireHistory} />
        <Route path="/ListAndroidDevices" component={ListAndroidDevices} />
        <Route path="/Area" component={Areas} />
        <Route path="/SysLog" component={SysLog} />
        <Route path="/Downloads" component={Downloads} />
        <Route path="/Account" component={Account} >
          <Route path="ChangePassword" component={ChangePassword} />
        </Route>
        <Route path="/Buildings" component={Buildings} />
        
      </Route>
      <Route path="/Login" component={Login}>

      </Route>

    </Router>
  </IntlProvider>,
  document.getElementById('root')
);
