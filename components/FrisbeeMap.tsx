import React from 'react';
import Leaflet from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from './leaflet/MarkerClusterGroup';
import 'leaflet/dist/leaflet.css';
import RegionSelect from './RegionSelect';
import { useRecoilValue } from 'recoil';
import { frisbeeClubsState } from '../store/state';
import TypeSwitch from './TypeSwitch';
import { ClubType } from './common/club-type';

const TITLE_LAYER_URL =
  'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}';
export const DEFAULT_MAP_CENTER: [number, number] = [
  39.90960456049752, 116.3972282409668,
];

function getClubTypeIcon(type: ClubType) {
  function createLeafletIcon(src: string) {
    return Leaflet.divIcon({
      className: 'border-none',
      iconAnchor: [18, 36],
      popupAnchor: [0, -34],
      html: `<img class="h-9" src="${src}" />`,
    });
  }

  const schoolIcon = createLeafletIcon('/assets/school-marker.svg');
  const womenIcon = createLeafletIcon('/assets/woman-marker.svg');
  const publicIcon = createLeafletIcon('/assets/public-marker.svg');
  const teenIcon = createLeafletIcon('/assets/teen-marker.svg');

  const CLUB_TYPE_ICON_MAP = {
    [ClubType.Public]: publicIcon,
    [ClubType.School]: schoolIcon,
    [ClubType.Women]: womenIcon,
    [ClubType.Teen]: teenIcon,
  };
  return CLUB_TYPE_ICON_MAP[type];
}

export interface IFrisbeeMapProps {
  className?: string;
}

const FrisbeeMap: React.FC<IFrisbeeMapProps> = (props) => {
  const { className } = props;
  const clubs = useRecoilValue(frisbeeClubsState);

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
              icon={getClubTypeIcon(club.type as ClubType)}
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
