import { action, autorun, computed, observable, useStrict } from 'mobx';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Vehicle from '../../models/vehicle';
import VehicleStore from '../../stores/vehicleStore';

import { SfVehicle } from '../sf-vehicle/sf-vehicle';

import './sf-vehicleList.css';

interface ISfVehicleListProps {
  map: any,
  vehicleStore?: VehicleStore
}

@inject("vehicleStore")
@observer
export class SfVehicleList extends Component<ISfVehicleListProps , any> {
  
  @computed public get vehicles() {
    return this.props.vehicleStore!.vehicles;
  }
  
  @computed public get visibleVehiclesCount() {
    return this.props.vehicleStore!.getVisibleVehicles.length;
  }
  
  public render() {
    return(
      <div className='sf-vehicleList'>
        <div className={'no-route-selected ' + (this.visibleVehiclesCount > 0 ? 'hidden' : '') } >
          <span>Click on a route to display its vehicles.</span>
        </div>
        { this.vehicles.map((vehicle: Vehicle) => 
          <SfVehicle key={vehicle.id} map={this.props.map} vehicle={vehicle} />) 
        }
      </div>
    );
  }
}