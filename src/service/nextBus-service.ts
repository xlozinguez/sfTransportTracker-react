import parse from 'xml-parser';

import Route from "../models/route";
import Stop from "../models/stop";
import { IVehicle } from "../models/vehicle";

const NEXT_BUS_URL = "http://webservices.nextbus.com/service/publicXMLFeed";
const DEFAULT_AGENCY = "sf-muni";

const NEXT_BUS_COMMAND = {
  routeConfig: "routeConfig",
  vehicleLocations: "vehicleLocations"
}

class NextBusService {
  private lastVehicleLocationsRequestTime: number = 0;
  
  public getRoutes(): Promise<Route[]> {
    return fetch(`${NEXT_BUS_URL}?command=${NEXT_BUS_COMMAND.routeConfig}&a=${DEFAULT_AGENCY}`)
    .then(results => results.text())
    .then(xmlRoutesData => {
      const routeList: Route[] = [];

      const xmlParser = parse(xmlRoutesData);

      xmlParser.root.children
        .filter(c => c.name === "route")
        .forEach(routeInfo => {
          const newRoute = new Route(
            routeInfo.attributes.tag,
            routeInfo.attributes.title,
            routeInfo.attributes.shortTitle,
            routeInfo.attributes.color,
            routeInfo.attributes.oppositeColor,
            routeInfo.attributes.latMin,
            routeInfo.attributes.latMax,
            routeInfo.attributes.lonMin,
            routeInfo.attributes.lonMax
          );

          routeInfo.children
            .filter(c => c.name === "stop")
            .forEach(stopInfo => {
              newRoute.stops.push(
                new Stop(
                  stopInfo.attributes.stopId, 
                  stopInfo.attributes.tag, 
                  stopInfo.attributes.title, 
                  stopInfo.attributes.lat, 
                  stopInfo.attributes.lon
                )
              )
            });
          routeList.push(newRoute);
        });

      return routeList;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
  }

  public getVehicleLocations(routeTag?: string): Promise<IVehicle[]> {
    let vehicleLocationsRequest = `${NEXT_BUS_URL}?command=${NEXT_BUS_COMMAND.vehicleLocations}&a=${DEFAULT_AGENCY}`;
    if(routeTag) {
      vehicleLocationsRequest += `&r=${routeTag}`
    }
    vehicleLocationsRequest += `&t=${this.lastVehicleLocationsRequestTime}`;

    return fetch(vehicleLocationsRequest)
    .then(results => {
      this.lastVehicleLocationsRequestTime = Date.now();
      return results.text();
    })
    .then(xmlVehicleLocationsData => {
      const vehicleObjList: IVehicle[] = [];
      
      const xmlParser = parse(xmlVehicleLocationsData);
      
      xmlParser.root.children
        .filter(c => c.name === "vehicle")
        .forEach(vehicleInfo => {
          const newVehicleInfo: IVehicle = {
            dirTag: vehicleInfo.attributes.dirTag,
            heading: vehicleInfo.attributes.heading,
            id: vehicleInfo.attributes.id,
            lat: vehicleInfo.attributes.lat,
            lon: vehicleInfo.attributes.lon,
            routeTag: vehicleInfo.attributes.routeTag
          };
          vehicleObjList.push(newVehicleInfo);
        });
        
      return vehicleObjList;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
  }
}

export default new NextBusService();