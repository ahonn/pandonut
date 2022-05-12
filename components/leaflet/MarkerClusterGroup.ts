import { MarkerClusterGroupOptions, MarkerClusterGroup } from 'leaflet';
import {
  createPathComponent,
  LeafletContextInterface,
} from '@react-leaflet/core';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export interface IMarkerClusterGroupProps {
  children: React.ReactNode;
}

function createClusterMarker(
  { children, ...props }: IMarkerClusterGroupProps,
  context: LeafletContextInterface,
) {
  const options: MarkerClusterGroupOptions = {};
  const events: Record<string, Function> = {};

  Object.entries(props).forEach(([propName, propVal]) => {
    if (propName.startsWith('on')) {
      events[propName as string] = propVal;
    } else {
      options[propName as keyof MarkerClusterGroupOptions] = propVal;
    }
  });
  const instance = new MarkerClusterGroup(options);

  // Initializing event listeners
  Object.entries(events).forEach(([eventAsProp, callback]) => {
    const event = `cluster${eventAsProp.substring(2).toLowerCase()}`;
    // @ts-ignore
    instance.on(event, callback);
  });
  return {
    instance,
    context: {
      ...context,
      layerContainer: instance,
    },
  };
}

const ClusterMarker = createPathComponent(createClusterMarker);

export default ClusterMarker;
