import { action, autorun, computed, createTransformer, intercept, observable, observe, reaction } from "mobx";

import Route from "../models/route";
import Vehicle from "../models/vehicle";

import { RootStore } from "./rootStore";

import nextBusService from '../service/nextBus-service';

export default class RouteStore {
  public rootStore: RootStore;
  @observable public routes: Route[] = [];
  @observable public routeStoreLoaded: boolean = false;

  // get stops for a given route
  @observable public getStopsForRoute = createTransformer((routeTag: string) => {
    return this.routes.filter((r: Route) => r.tag === routeTag); // .stops?
  });

  // get vehicles for a given route
  @observable public getVehiclesForRoute = createTransformer((routeTag: string) => {
    return this.rootStore.vehicleStore.vehicles.filter((v: Vehicle) => v.routeTag === routeTag);
  });

  // get selected routes array
  @computed get selectedRoutes(): Route[] {
    return this.routes.filter((r: Route) => r.selected);
  };
  
  // get vehicles for a given route
  @computed get vehiclesForRoute(): Vehicle[] {
    const vehicles = this.rootStore.vehicleStore.vehicles;
    const selectedRouteTags = this.selectedRoutes.map((r: Route) => r.tag);
    return vehicles.filter((vehicle: Vehicle) => selectedRouteTags.indexOf(vehicle.routeTag) >= 0);
  }

  // get vehicles for list of selected routes
  @computed get vehiclesForSelectedRoutes(): Vehicle[] {
    const vehicles = this.rootStore.vehicleStore.vehicles;
    const selectedRouteTags = this.selectedRoutes.map((r: Route) => r.tag);
    return vehicles.filter((vehicle: Vehicle) => selectedRouteTags.indexOf(vehicle.routeTag) >= 0);
  }

  constructor(rootStore: RootStore) {
    // save reference to rootStore
    this.rootStore = rootStore;

    // load up routes
    nextBusService
      .getRoutes()
      .then((routes: Route[]) => {
        routes.forEach((route: Route) => {
          this.addRoute(route);
        });
        this.toggleRouteStoreLoaded();
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  }

  // toggle indicator that routes have been loaded
  @action.bound public toggleRouteStoreLoaded() {
    this.routeStoreLoaded = !this.routeStoreLoaded;
  }

  // add new route to list
  @action.bound public addRoute(newRoute: Route) {
    this.routes.push(newRoute);
  }
  
  // mark route as un/selected and propagate to set up route's vehicles visiblity
  @action public toggleRouteSelected(route: Route) {
    this.getVehiclesForRoute(route.tag).forEach((v: Vehicle) => v.toggleVisibility());
    route.toggleSelected();
  }
}