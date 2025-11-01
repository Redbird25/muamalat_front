import React, {Suspense} from 'react';
import { createRoot } from 'react-dom/client';
import {Provider} from "react-redux";
import {I18nextProvider} from "react-i18next";
import {YMaps} from "@pbe/react-yandex-maps";
import App from './App';
import configureStore from './redux/store';
import {Spinner} from "./components";
import {i18n, api} from "./services";
import config from './config';
import './assets/styles/custom.scss';
import "./assets/styles/style.css";
import "./assets/styles/main.css";
import "./assets/styles/master.scss";

const store = configureStore();

store.subscribe(() => {
  api.subscribe(store);
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner center/>}>
      <I18nextProvider i18n={i18n}>
        <YMaps query={{ apikey: config.YANDEX_KEY }}>
          <App/>
        </YMaps>
      </I18nextProvider>
    </Suspense>
  </Provider>
);
