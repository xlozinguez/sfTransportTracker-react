import { action, autorun, computed, observable, reaction, useStrict } from 'mobx';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Vehicle from '../../models/vehicle';

interface ISfVehicleProps {
  map: any,
  vehicle: Vehicle
}

@observer
export class SfVehicle extends Component<ISfVehicleProps , any> {
  public marker = null;

  // Reaction triggered upon visibility change
  public visibilityUpdateReaction = reaction(
    () => this.props.vehicle.visible,
    (visibility: boolean) => this.updateVehicleVisibility(visibility)
  );

  public componentWillMount() {
    this.displayVehicle();
  }
  
  public render() {
    return(null);
  }

  // display vehicle marker on the map
  private displayVehicle = () => {
    const { map, vehicle } = this.props;
    this.marker = new (window as any).google.maps.Marker({
      label: {
        // color: `#${v.routeColor}`,
        text: `${vehicle.id}`
      },
      map,
      position: {
        lat: +vehicle.lat,
        lng: +vehicle.lon
      },
      visible: vehicle.visible
    });
  }

  private updateVehicleVisibility = (visible: boolean) => (this.marker as any).setVisible(visible)
}