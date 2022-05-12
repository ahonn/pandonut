import React from 'react';
import Leaflet from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerClusterGroup from './leaflet/MarkerClusterGroup';
import 'leaflet/dist/leaflet.css';
import RegionSelect from './RegionSelect';
import useFrisbeeClubContext from '../hooks/useFrisbeeClubContext';

const TITLE_LAYER_URL =
  'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}';
export const DEFAULT_MAP_CENTER: [number, number] = [39.90960456049752, 116.3972282409668];

Leaflet.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: '',
});

export interface IFrisbeeMapProps {
  className?: string;
}

const FrisbeeMap: React.FC<IFrisbeeMapProps> = (props) => {
  const { className } = props;
  const clubs = useFrisbeeClubContext();

  return (
    <MapContainer
      className={className}
      center={DEFAULT_MAP_CENTER}
      zoom={4}
      scrollWheelZoom={true}
    >
      <TileLayer url={TITLE_LAYER_URL} />
      <MarkerClusterGroup>
        {clubs.map((club, index) => {
          return (
            <Marker position={[+club.lat, +club.lon]} key={club.name + index}>
              <Popup>{club.name}</Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <RegionSelect />
    </MapContainer>
  );
};

export default FrisbeeMap;
