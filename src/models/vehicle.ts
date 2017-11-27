import { action, observable } from "mobx";

export default class Vehicle {
  public id: string;
  @observable public routeTag: string;
  @observable public dirTag: string;
  @observable public lat: string;
  @observable public lon: string;
  @observable public heading: string;
  @observable public routeColor: string;
  @observable public visible: boolean;

  constructor(
    id: string = '', 
    routeTag: string = '', 
    dirTag: string = '', 
    lat: string = '', 
    lon: string = '', 
    heading: string = ''
  ) {
    this.id = id;
    this.routeTag = routeTag;
    this.dirTag = dirTag;
    this.lat = lat;
    this.lon = lon;
    this.heading = heading;
    this.visible = false;
  }
  
  // Un/mark vehicle as visible
  @action.bound public toggleVisibility() {
    this.visible = !this.visible;
  }
}
