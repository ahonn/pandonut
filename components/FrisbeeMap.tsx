import React, { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Leaflet from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// @ts-ignore
import { Series } from 'pandas-js';
import 'leaflet/dist/leaflet.css';
import { IFrisbeeClubRecord } from '../database/vika';

const TITLE_LAYER_URL =
  'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}';

Leaflet.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

export interface IFrisbeeMapProps {
  data: IFrisbeeClubRecord[];
  province: string | null;
  className?: string;
}

const FrisbeeMap: React.FC<IFrisbeeMapProps> = (props) => {
  const { data, province, className } = props;

  const center = useMemo(() => {
    const points = data
      .filter((item) => !province || item.province === province)
      .map(({ lat, lon }) => [+lat, +lon]);
    const series = new Series(points);
    return series.median();
  }, [data, province]);

  return (
    <MapContainer
      className={className}
      center={center}
      zoom={4}
      scrollWheelZoom={false}
    >
      <TileLayer url={TITLE_LAYER_URL} />
      {data.map((club, index) => {
        return (
          <Marker position={[+club.lat, +club.lon]} key={club.name + index}>
            <Popup>{club.name}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default FrisbeeMap;
