import { createTransformer, observable } from 'mobx';
import Vehicle from '../models/vehicle';
import { RootStore } from './rootStore';

import nextBusService from '../service/nextBus-service';

export default class VehicleStore {
  public rootStore: RootStore;
  @observable public vehicles: Vehicle[] = [];

  @observable public getVehiclesForRoute = createTransformer(routeTag => {
    return this.vehicles.filter(v => v.routeTag === routeTag);
  });

  constructor(rootStore: RootStore) {
    // save reference to rootStore
    this.rootStore = rootStore;
    
    // load up routes
    nextBusService.getVehicleLocations('38')
        .then((vehicles: Vehicle[]) => {
          console.log('VehicleStore: getVehicleLocations: ', vehicles);
          vehicles.forEach((vehicle: Vehicle) => {
            this.vehicles.push(vehicle);
          });
        })
        .catch((err) => {
          console.error(err);
          return;
        });
  }
}