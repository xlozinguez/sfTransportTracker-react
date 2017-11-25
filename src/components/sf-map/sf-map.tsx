import { action, autorun, computed, observable, useStrict } from 'mobx';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const GMAPS_API_KEY = 'YOUR_GMAPS_API_KEY_HERE';

import Vehicle from '../../models/vehicle';
import VehicleStore from '../../stores/vehicleStore';

import './sf-map.css';

useStrict(true);

interface ISfMapProps {
  latitude: string, 
  longitude: string, 
  vehicleStore?: VehicleStore
}

@inject("vehicleStore")
@observer
export class SfMap extends Component<ISfMapProps , any> {
  public mapEl: HTMLElement;

  @observable public mapLoaded: boolean = false;
  
  public map: null;

  constructor (props: any) {
    super(props);
    autorun(() => {
      console.log('autorun: ', this.mapLoaded);
      if (this.mapLoaded) {
        this.displayVehicles();
      }
    })
  }
  
  @action.bound public toggleMapState() {
    console.log('toggleMapState');
    this.mapLoaded = !this.mapLoaded;
  }
  
  @computed public get vehicles() {
    return this.props.vehicleStore!.vehicles;
  }
  
  public componentWillMount() {
    console.log('componentDidWillMount');
    this.initMap();
  }

  public componentDidMount() {
    console.log('componentDidMount');
    this.mapEl = ReactDOM.findDOMNode(this) as HTMLElement;
    this.loadMap();
  }

  public render() {
    return (
      <div className="sf-map">
        The map could not be loaded.
      </div>
    );
  }
  
  // Initialize google map script
  private initMap = () => {
    console.log('SfMap: initMap');
    const gMapsScript = document.createElement('script');
    gMapsScript.setAttribute('async', '');
    gMapsScript.setAttribute('defer', '');
    gMapsScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${GMAPS_API_KEY}`);
    document.getElementById('root')!.appendChild(gMapsScript);
  }

  // Load map and set to the current position
  private loadMap = () => {
    console.log('SfMap: loadMap');
    let timeout = null;
    // Check for map being loaded
    if (!window.hasOwnProperty('google')) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(()=>{
        this.loadMap();
      }, 1000);
    } else {
      clearTimeout(timeout as any);
      // Create the map and set the current position
      const latlng = new (window as any).google.maps.LatLng(+this.props.longitude,+this.props.latitude);
      this.map = new (window as any).google.maps.Map(this.mapEl, {
        center: latlng,
        zoom: 13
      });
      this.toggleMapState();
    }
  }

  // display vehicles on the map
  private displayVehicles = () => {
    console.log('SfMap: displayVehicles', this.vehicles.length);
    this.vehicles.forEach(v => {
      return new (window as any).google.maps.Marker({
        label: `${v.id}`,
        map: this.map,
        position: {
          lat: +v.lat,
          lng: +v.lon
        }
      })
    });
  }
}