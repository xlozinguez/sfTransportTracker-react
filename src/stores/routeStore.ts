import { action, createTransformer, observable } from "mobx";
import Route from "../models/route";
import { RootStore } from "./rootStore";

import nextBusService from '../service/nextBus-service';

export default class RouteStore {
  public rootStore: RootStore;
  
  @observable public routes: Route[] = [];
  @observable public routeStoreLoaded: boolean = false;

  @observable public getStopsForRoute = createTransformer((routeTag: string) => {
    return this.routes.filter(r => r.tag === routeTag);
  });
  
  constructor(rootStore: RootStore) {
    // save reference to rootStore
    this.rootStore = rootStore;

    // load up routes
    nextBusService.getRoutes()
      .then((routes: Route[]) => {
        // console.log('got routes');
        routes.forEach((route: Route) => {
          // console.log('adding route');
          this.addRoute(route);
        });
        // console.log('routes loaded');
        this.toggleRouteStoreLoaded();
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  }

  @action.bound public toggleRouteStoreLoaded() {
    this.routeStoreLoaded = !this.routeStoreLoaded;
  }

  @action.bound public addRoute(newRoute: Route) {
    this.routes.push(newRoute);
    // console.log('RouteStore is loaded')
  }
}