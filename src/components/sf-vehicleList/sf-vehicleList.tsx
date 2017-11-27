import { action, autorun, computed, observable, useStrict } from 'mobx';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Vehicle from '../../models/vehicle';
import VehicleStore from '../../stores/vehicleStore';

import { SfVehicle } from '../sf-vehicle/sf-vehicle';

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
  
  public render() {
    return(
      <div className='sf-vehicle-list'>
        { this.vehicles.map((vehicle: Vehicle) => 
          <SfVehicle key={vehicle.id} map={this.props.map} vehicle={vehicle} />) 
        }
      </div>
    );
  }
}