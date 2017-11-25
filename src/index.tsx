import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'mobx-react';

import { RootStore } from './stores/rootStore';

import { SfMap } from './components/sf-map/sf-map';
import { SfRouteList } from './components/sf-routeList/sf-routeList';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

const rootStore = new RootStore();

ReactDOM.render(
  <Provider 
    routeStore={rootStore.routeStore}
    vehicleStore={rootStore.vehicleStore}
  >
    <div id="root" className="sf-transit-tracker">
      <SfMap longitude="37.7749" latitude="-122.4194" />
      <SfRouteList />
    </div>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();