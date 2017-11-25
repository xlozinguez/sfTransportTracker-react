import { computed, useStrict } from 'mobx';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';

import Route from '../../models/route';
import RouteStore from '../../stores/routeStore';

import './sf-routeList.css';

useStrict(true);

interface ISfRouteListProps {
  routeStore?: RouteStore
}

@inject("routeStore")
@observer
export class SfRouteList extends Component<ISfRouteListProps, any> {

  @computed public get routes() {
    return this.props.routeStore!.routes;
  }

  public render() {
    return (
      <div className="sf-routeList">
        <h1>Routes</h1>
        <ul>
          { this.renderRoutes() }
        </ul>
      </div>
    );
  }
  
  private renderRoutes = () => {
    return this.routes ? this.routes.map((r: Route) => {
      return (<li key={r.tag}> { r.tag } - { r.title } - {r.stops.length} </li>)
    }) : null
  }
}