import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@app/common.css';
import { App } from '@app/components/App/App';
import { store } from '@app/store';
import { NetworkStatusContextProvider } from '@features/networkStatus/NetworkStatusContextProvider';
import { initI18n } from '@features/locale/utils';
import * as Sentry from '@sentry/react';

declare global {
  interface Window {
    SENTRY_RELEASE: string;
  }
}

if (window.SENTRY_RELEASE) {
  Sentry.init({
    dsn: 'https://3b5f87c52947426c86d77f8fc7382aaf@o1144149.ingest.sentry.io/6206560',
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('sw register success');
    })
    // eslint-disable-next-line no-console
    .catch(() => console.log('sw error'));
}

initI18n(() => {
  ReactDOM.render(
    <Provider store={store}>
      <NetworkStatusContextProvider>
        <Router>
          <App />
        </Router>
      </NetworkStatusContextProvider>
    </Provider>,
    document.getElementById('root')
  );
});
