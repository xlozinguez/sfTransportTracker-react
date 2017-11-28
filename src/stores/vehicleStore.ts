import { action, computed, createTransformer, observable } from 'mobx';

import Route from '../models/route';
import Vehicle, { IVehicle } from '../models/vehicle';

import { RootStore } from './rootStore';

import nextBusService from '../service/nextBus-service';

export default class VehicleStore {
  public rootStore: RootStore;
  public vehicleLocationsRefreshTimer: any = null;
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
    
    this.fetchVehicleLocations();

    // load up routes and refresh every 15 seconds
    this.vehicleLocationsRefreshTimer = setInterval(() => this.fetchVehicleLocations(), 15000);
  }
  
  // toggle indicator that vehicles have been loaded
  @action.bound public toggleVehicleStoreLoaded() {
    this.vehicleStoreLoaded = !this.vehicleStoreLoaded;
  }

  // add vehicle to the list or update with the new values
  @action.bound public addorUpdateVehicle(vehicleObj: IVehicle) {
    const vehicle = this.vehicles.filter((v: Vehicle) => v.id === vehicleObj.id);
    if (vehicle.length) {
      // if the vehicle already exists, update its information
      vehicle[0].updateVehicle(vehicleObj);
    } else {
      // if not, create a new vehicle and add it in the array
      this.vehicles.push(new Vehicle(vehicleObj));
    }
    // TODO: remove vehicles that are not part of the response anymore
  }

  private fetchVehicleLocations() {
    console.log('Fetching vehicle locations');

    nextBusService
      .getVehicleLocations() 
      .then((vehicleObjs: IVehicle[]) => {
        vehicleObjs.forEach((vehicleObj: IVehicle) => {
          // TODO: load vehicles after routes have been loaded (could leverage side effects)
          // vehicle.routeColor = this.rootStore.routeStore.getColorOfRoute(vehicle.routeTag);
          this.addorUpdateVehicle(vehicleObj);
        });
        this.toggleVehicleStoreLoaded();
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  }
}