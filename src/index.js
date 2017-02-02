import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import IndexMap from './pages/Map/IndexMap';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import { IntlProvider } from 'react-intl';
import * as generatedMessages from './i18n';

ReactDOM.render(
  <IntlProvider locale="vi" messages={generatedMessages.translationMessages.vi}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={IndexMap} />
      </Route>
    </Router>
  </IntlProvider>,
  document.getElementById('root')
);
