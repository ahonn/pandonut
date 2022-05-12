import React, { useMemo } from 'react';
// @ts-ignore
import { Series } from 'pandas-js';
import Leaflet from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import { IFrisbeeClubRecord } from '../database/vika';
import MarkerClusterGroup from './leaflet/MarkerClusterGroup';
import 'leaflet/dist/leaflet.css';

const TITLE_LAYER_URL =
  'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}';
const DEFAULT_MAP_CENTER = [39.90960456049752, 116.3972282409668];

Leaflet.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: '',
});

export interface IFrisbeeMapProps {
  data: IFrisbeeClubRecord[];
  province: string | null;
  className?: string;
}

const FrisbeeMap: React.FC<IFrisbeeMapProps> = (props) => {
  const { data, province, className } = props;

  const center = useMemo(() => {
    if (province) {
      const points = data
        .filter((item) => item.province === province)
        .map(({ lat, lon }) => [+lat, +lon]);
      const series = new Series(points);
      return series.median();
    }
    return DEFAULT_MAP_CENTER;
  }, [data, province]);

  return (
    <MapContainer
      className={className}
      center={center}
      zoom={4}
      scrollWheelZoom={false}
    >
      <TileLayer url={TITLE_LAYER_URL} />
      {/* @ts-ignore */}
      <MarkerClusterGroup>
        {data.map((club, index) => {
          return (
            <Marker position={[+club.lat, +club.lon]} key={club.name + index}>
              <Popup>{club.name}</Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default FrisbeeMap;
