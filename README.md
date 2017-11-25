# SF Transit using StencilJS

Using [Google Maps](https://developers.google.com/maps/) and [NextBus](http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf) API, fetch the vehicle's positions for the `sf-muni` agency. Update those positions every 15 seconds.

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
- sf-vehicle
- sf-route
    - sf-route-stop-list
    - sf-stop

### Services
- nextBus-service

## App Workflow

### Upon app initialization
- initialize the **`sf-map`** component
- fetch **sf-muni** agency vehicles position
- display visible transport position using the **`sf-vehicle`** component

### Vehicule position update
- every 15 seconds, fetch positions for visible vehicle on the map

## Use Cases

### Main

- [ ] if the user resize the map, refresh the position of displayed vehicle
- [ ] if the user selects a subset of available routes, only display the vehicle for the selected routes

### Nice to haves

- [ ] if the user hover over or click onto a given transport:
    - [ ] filter out the other routes and vehicle
    - [ ] provide some info regarding the selected transport (route info, previous stop info, next stop info)
    - [ ] trace the route on the map

## Useful API details

### NextBus - http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf

- ***routeConfig*** (`http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=<agency_tag>&r=<route tag>`):
    - obtain a list of routes for an agency
    - capped at 100 routes per request (when no route is specified)
    - includes the extent of the route (helpful to filter out a route that is out of scope)
- ***vehicleLocations*** (`http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=<agency_tag>&r=<route tag>&t=<epoch time in msec>`):
    -  obtains a list of vehicle locations **that have changed** since the last time the vehicleLocations command was used
    - 

### Google Maps - https://developers.google.com/maps/
- To be able to use the google maps api, one will need to get an API key issued. See [Get Api Key](https://developers.google.com/maps/documentation/javascript/get-api-key)