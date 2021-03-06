import { action, observable } from "mobx";

import Stop from "./stop";

export default class Route {
  public tag: string;
  public title: string;
  public shortTitle: string;
  public color: string;
  public oppositeColor: string;
  public latMin: string;
  public latMax: string;
  public lonMin: string;
  public lonMax: string;
  @observable public selected: boolean = false;
  @observable public stops: Stop[];

  constructor(
    tag: string = '', 
    title: string = '', 
    shortTitle: string = '', 
    color: string = '', 
    oppositeColor: string = '', 
    latMin: string = '', 
    latMax: string = '', 
    lonMin: string = '', 
    lonMax: string = ''
  ) {
    this.tag = tag;
    this.title = title;
    this.shortTitle = shortTitle;
    this.color = color;
    this.oppositeColor = oppositeColor;
    this.latMin = latMin;
    this.latMax = latMax;
    this.lonMin = lonMin;
    this.lonMax = lonMax;
    this.stops = [];
  }
  
  // Un/mark route as selected
  @action.bound public toggleSelected() {
    this.selected = !this.selected;
  }
}
