import { action, observable } from "mobx";

export interface IVehicle {
  id: string,
  routeTag: string,
  dirTag: string,
  lat: string,
  lon: string,
  heading: string,
}

export default class Vehicle implements IVehicle {
  public id: string;
  @observable public routeTag: string;
  @observable public dirTag: string;
  @observable public lat: string;
  @observable public lon: string;
  @observable public heading: string;
  @observable public routeColor: string;
  @observable public visible: boolean;

  constructor(vehicleObj: IVehicle) {
    this.id = vehicleObj.id;
    this.routeTag = vehicleObj.routeTag;
    this.dirTag = vehicleObj.dirTag;
    this.lat = vehicleObj.lat;
    this.lon = vehicleObj.lon;
    this.heading = vehicleObj.heading;
    this.visible = false;
  }
  
  // Un/mark vehicle as visible
  @action.bound public toggleVisibility() {
    this.visible = !this.visible;
  }
  
  // Update vehicle information
  @action.bound public updateVehicle(vehicleObj: IVehicle) {
    this.routeTag = vehicleObj.routeTag;
    this.dirTag = vehicleObj.dirTag;
    this.lat = vehicleObj.lat;
    this.lon = vehicleObj.lon;
    this.heading = vehicleObj.heading;
  }
}
