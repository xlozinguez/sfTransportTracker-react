import { action, computed, createTransformer, observable } from 'mobx';

import Route from '../models/route';
import Vehicle from '../models/vehicle';

import { RootStore } from './rootStore';

import nextBusService from '../service/nextBus-service';

export default class VehicleStore {
  public rootStore: RootStore;
  @observable public vehicles: Vehicle[] = [];
  @observable public vehicleStoreLoaded: boolean = false;

  @computed get getVisibleVehicles() : Vehicle[] {
    return this.rootStore.routeStore.selectedRoutes
      .map((route: Route) => this.vehicles.filter((vehicle: Vehicle) => vehicle.routeTag === route.tag))
      .reduce((visibleVehicles: Vehicle[], vehicles: Vehicle[]) => visibleVehicles.concat(vehicles), []);
  }

  constructor(rootStore: RootStore) {
    // save reference to rootStore
    this.rootStore = rootStore;
    
    // load up routes
    nextBusService.getVehicleLocations() 
        .then((vehicles: Vehicle[]) => {
          vehicles.forEach((vehicle: Vehicle) => {
            // TODO: load vehicles after routes have been loaded (could leverage side effects)
            // vehicle.routeColor = this.rootStore.routeStore.getColorOfRoute(vehicle.routeTag);
            this.addVehicle(vehicle);
          });
          this.toggleVehicleStoreLoaded();
        })
        .catch((err) => {
          console.error(err);
          return;
        });
  }
  
  // toggle indicator that vehicles have been loaded
  @action.bound public toggleVehicleStoreLoaded() {
    // console.log('Vehicle Store loaded!');
    this.vehicleStoreLoaded = !this.vehicleStoreLoaded;
  }

  // add new vehicle to list
  @action.bound public addVehicle(newVehicle: Vehicle) {
    this.vehicles.push(newVehicle);
  }
}