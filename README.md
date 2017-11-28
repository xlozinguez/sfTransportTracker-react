# SF Transit using StencilJS

Using [Google Maps](https://developers.google.com/maps/) and [NextBus](http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf) API, fetch the vehicle's positions for the `sf-muni` agency. Update those positions every 15 seconds.

## Tech Stack
- [React](https://reactjs.org/docs) with [Typescript](https://www.typescriptlang.org/) and [JSX](https://reactjs.org/docs/jsx-in-depth.html)
- [Mobx](https://mobx.js.org/) - https://mobx.js.org/

## Personal Take Away
- Mobx implementation of the observable pattern is very different than what an observable is
- Store composition is not very evident (probably more to learn on that end - see challenge with fetching routeColor for a vehicle)
- **KEY TAKEAWAY**: "`MobX only tracks synchronously accessed data`" from ["What does MobX react to?"
](https://mobx.js.org/best/react.html)

## Architecture

### Objects
- **route**
    - **tag** (string) – unique alphanumeric identifier for the route
    - **title** (string) - the name of the route
    - **shortTitle** (string) – shorter title
    - **color** (string) – color of the route for quick visual identification
    - **oppositeColor** (color) – the color that most contrasts with the route color. 
    - **latMin, latMax, lonMin, lonMax** – specifies the extent of the route.
- **stop**
    - **tag** (string) – unique alphanumeric identifier for stop, such as “cp_1321”
    - **title** (string) – the name of the stop
    - **shortTitle** (string) – shorter title
    - **lat/lon** – specify the location of the stop.
    - **stopId** (string) – an optional numeric ID to identify a stop
- **vehicle**
    - **id** (string) – Identifier of the vehicle
    - **routeTag** (string) - Specifies the ID of the route the vehicle is currently associated with.
    - **dirTag** (string) - Specifies the ID of the direction that the vehicle is currently on.
    - **lat/lon** – specify the location of the vehicle.
    - **secsSinceReport** (int) – How many seconds since the GPS location was actually recorded. It should be noted that sometimes a GPS report can be several minutes old.
    - **predictable** (boolean) – Specifies whether the vehicle is currently predictable.
    - **heading** (int) – Specifies the heading of the vehicle in degrees. Will be a value between 0 and 360. A negative value indicates that the heading is not currently available.
    - **speedKmHr** (double) – Specifies GPS based speed of vehicle.

### Components
- sf-map
- sf-vehicleList
    - sf-vehicle
- sf-routeList
    - sf-route

### Stores
- rootStore
    - routeStore
    - vehicleStore

### Services
- nextBus-service

## App Workflow

### Upon app initialization
- fetch **sf-muni** agency routes configuration
- fetch **sf-muni** agency vehicles position
- initialize the **sf-map** component
    - setup **sf-vehicleList** component to handle list of vehicles
    - display each **sf-vehicle** upon loading the **vehicleStore**
- initialize the **sf-routeList** component
    - display each **sf-route** upon loading the **routeStore**

### Vehicule position update
- every 15 seconds, fetch positions for visible vehicle on the map

## Usage

### Start
- Clone the repo
- Install npm dependencies using the `$ npm install` command
- In the **[sf-map](/src/components/sf-map/sf-map.tsx#L6)** component definition file, replace the `GMAPS_API_KEY` with yours (see [Get Api Key](https://developers.google.com/maps/documentation/javascript/get-api-key) to find out how to get your own gmap  api key)
- Finally run `npm start` and open the [http://localhost:3000](http://localhost:3000) url in your browser

### UX
- Select/Deselect the routes that you want to track vehicles of by click on them
- Observe markers being updated every 15 seconds

![SF Transit Tracker](/demo.gif)

### TO-DO
 - [ ] Unit tests (*Lord forgive me for i have sinned*)
 - [ ] Enhance UX transition for vehicles between location updates (see [a great example](http://jsfiddle.net/pmrotule/9tfq5sqc/8/))
 - [ ] Enhance Marker display
 - [ ] Better code documentation?
 - [ ] Remove vehicle when stalled
 - [ ] See how to reproduce the same output [in Stencil](https://github.com/xlozinguez/sfTransportTracker-react) (aborted due to store injection obstacle that can be resolved I am sure)

## Useful API details

### NextBus - http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf

- ***routeConfig*** (`http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=<agency_tag>&r=<route tag>`):
    - obtain a list of routes for an agency
    - capped at 100 routes per request (when no route is specified)
    - includes the extent of the route (helpful to filter out a route that is out of scope)
- ***vehicleLocations*** (`http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=<agency_tag>&r=<route tag>&t=<epoch time in msec>`):
    -  obtains a list of vehicle locations **that have changed** since the last time the vehicleLocations command was used

### Google Maps - https://developers.google.com/maps/
- To be able to use the google maps api, one will need to get an API key issued. See [Get Api Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
