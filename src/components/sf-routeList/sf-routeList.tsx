import { action, computed, useStrict } from 'mobx';
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
    const selectedRouteCount = this.props.routeStore!.selectedRoutes.length;
    const totalRouteCount = this.props.routeStore!.routes.length;
    return (
      <div className="sf-routeList">
        <h1>
          Routes
          <span className="subtitle">({selectedRouteCount}/{totalRouteCount} selected)</span>
        </h1>
        <ul>
          { this.renderRoutes() }
        </ul>
      </div>
    );
  }
  
  public toggleSelected(route: Route) {
    this.props.routeStore!.toggleRouteSelected(route);
  }

  private renderRoutes = () => {
    return this.routes.map((r: Route) => {
      return (
        <li 
          className={"route " + (r.selected ? "selected" : "")}
          key={r.tag}
          onClick={this.toggleSelected.bind(this, r)}> 
            <span 
              className="route-tag" 
              style={{ 
                backgroundColor: `#${r.color}`,
                borderColor: `#${r.oppositeColor}`
              }}>{ r.tag }</span>
            <span 
              className="route-title"
              dangerouslySetInnerHTML={{ __html: r.title }} />
            ({r.stops.length})
        </li>
      )
    });
  }
}