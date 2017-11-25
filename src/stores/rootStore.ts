import RouteStore from './routeStore';
import VehicleStore from './vehicleStore';

export class RootStore {
  public vehicleStore: VehicleStore;
  public routeStore: RouteStore;
  
  constructor() {
    this.vehicleStore = new VehicleStore(this);
    this.routeStore = new RouteStore(this);
  }
}