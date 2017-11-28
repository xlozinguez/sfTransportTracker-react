import { action, autorun, computed, observable, useStrict } from 'mobx';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const GMAPS_API_KEY = 'YOUR_GMAPS_API_KEY_HERE';

import RouteStore from '../../stores/routeStore';
import VehicleStore from '../../stores/vehicleStore';

import { SfVehicleList } from '../sf-vehicleList/sf-vehicleList';

import './sf-map.css';

useStrict(true);

interface ISfMapProps {
  latitude: string, 
  longitude: string,
  routeStore?: RouteStore,
  vehicleStore?: VehicleStore
}

@inject("routeStore", "vehicleStore")
@observer
export class SfMap extends Component<ISfMapProps , any> {
  public mapEl: HTMLElement;

  @observable public mapLoaded: boolean = false;
  
  public map: null;
  
  @action.bound public toggleMapState() {
    this.mapLoaded = !this.mapLoaded;
  }
  
  public componentWillMount() {
    this.initMap();
  }

  public componentWillUnmount() {
    // remove interval timer when the component unmounts
    clearInterval(this.props.vehicleStore!.vehicleLocationsRefreshTimer);
  }

  public componentDidMount() {
    this.mapEl = ReactDOM.findDOMNode(this).firstElementChild as HTMLElement;
    this.loadMap();
  }

  public render() {
    return (
      <div>
        <div className="sf-map">
          Loading map...
        </div>
        { 
          this.mapLoaded && 
          <SfVehicleList map={this.map} />
        }
      </div>
    );
  }
  
  // Initialize google map script
  private initMap = () => {
    const gMapsScript = document.createElement('script');
    gMapsScript.setAttribute('async', '');
    gMapsScript.setAttribute('defer', '');
    gMapsScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${GMAPS_API_KEY}`);
    document.getElementById('root')!.appendChild(gMapsScript);
  }

  // Load map and set to the current position
  private loadMap = () => {
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
        zoom: 12
      });
      this.toggleMapState();
    }
  }
}