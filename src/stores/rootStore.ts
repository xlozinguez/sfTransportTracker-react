import RouteStore from './routeStore';
import VehicleStore from './vehicleStore';

export class RootStore {
  public vehicleStore: VehicleStore;
  public routeStore: RouteStore;
  
  constructor() {
    this.routeStore = new RouteStore(this);
    this.vehicleStore = new VehicleStore(this);
  }
}