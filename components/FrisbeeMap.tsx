import React from 'react';
import Leaflet from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from './leaflet/MarkerClusterGroup';
import 'leaflet/dist/leaflet.css';
import RegionSelect from './RegionSelect';
import { useRecoilValue } from 'recoil';
import { ClubType, frisbeeClubsState } from '../store/state';
import TypeSwitch from './TypeSwitch';

const TITLE_LAYER_URL =
  'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}';
export const DEFAULT_MAP_CENTER: [number, number] = [39.90960456049752, 116.3972282409668];

const schoolIcon = Leaflet.divIcon({
  className: 'border-none',
  iconAnchor: [18, 36],
  popupAnchor: [0, -34],
  html: `<img class="h-9" src="/assets/school-marker.svg" />`
});

const womenIcon = Leaflet.divIcon({
  className: 'border-none',
  iconAnchor: [18, 36],
  popupAnchor: [0, -34],
  html: `<img class="h-9" src="/assets/woman-marker.svg" />`
});

const publicIcon = Leaflet.divIcon({
  className: 'border-none',
  iconAnchor: [18, 36],
  popupAnchor: [0, -34],
  html: `<img class="h-9" src="/assets/public-marker.svg" />`
});

export interface IFrisbeeMapProps {
  className?: string;
}

function getMarkerIcon(type: string) {
  if (type === ClubType.School) {
    return schoolIcon;
  }
  if (type === ClubType.Women) {
    return womenIcon;
  }
  return publicIcon;
}

const FrisbeeMap: React.FC<IFrisbeeMapProps> = (props) => {
  const { className } = props;
  const clubs = useRecoilValue(frisbeeClubsState)

  return (
    <MapContainer
      className={className}
      center={DEFAULT_MAP_CENTER}
      zoom={4}
      minZoom={2}
      maxZoom={17}
      doubleClickZoom={false}
      scrollWheelZoom={true}
    >
      <TileLayer url={TITLE_LAYER_URL} />
      <MarkerClusterGroup>
        {clubs.map((club, index) => {
          return (
            <Marker
              key={club.name + index}
              position={[+club.lat, +club.lon]}
              icon={getMarkerIcon(club.type)}
            >
              <Popup>{club.name}</Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <RegionSelect className="absolute bottom-2 left-2" />
      <TypeSwitch className="absolute top-2 right-2" />
    </MapContainer>
  );
};

export default FrisbeeMap;
