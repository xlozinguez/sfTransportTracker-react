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

  // Reaction triggered upon vehicle visibility change
  public visibilityUpdateReaction = reaction(
    () => this.props.vehicle.visible,
    (visibility: boolean) => this.updateVehicleVisibility(visibility)
  );
  
  // Reaction triggered upon vehicle location change
  public locationUpdateReaction = reaction(
    () => {
      return {
        lat: +this.props.vehicle.lat,
        lng: +this.props.vehicle.lon
      }
    },
    (position: {lat: number, lng: number}) => this.updateVehiclePosition(position.lat, position.lng)
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

  private updateVehicleVisibility = (visible: boolean) => (this.marker as any).setVisible(visible);

  private updateVehiclePosition = (lat: number, lng: number) => (this.marker as any).setPosition({ lat, lng });
}