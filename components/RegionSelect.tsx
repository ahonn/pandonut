import { Select } from '@mantine/core';
import * as turf from '@turf/turf';
import { useLeafletContext } from '@react-leaflet/core';
import React, { useMemo, useState } from 'react';
import useFrisbeeClubContext from '../hooks/useFrisbeeClubContext';
import { DEFAULT_MAP_CENTER } from './FrisbeeMap';

const RegionSelect: React.FC = () => {
  const [province, setProvince] = useState<string | null>('');
  const [city, setCity] = useState<string | null>('');
  const leafletContext = useLeafletContext();
  const clubs = useFrisbeeClubContext();

  const provinces = useMemo(
    () => Array.from(new Set(clubs.map((c) => c.province))),
    [clubs],
  );

  const citys = useMemo(
    () => Array.from(new Set(clubs.filter((c) => !province || c.province === province).map((c) => c.city))),
    [clubs, province],
  );

  const setMapViewCenter = (points: [number, number][], zoom = 8) => {
    if (points.length >= 4) {
      const polygon = turf.polygon([[...points, points[0]]]);
      const centroid = turf.centroid(polygon);
      leafletContext.map.setView(
        centroid.geometry.coordinates as [number, number],
        zoom,
      );
    } else {
      leafletContext.map.setView(points[0], zoom);
    }
  }

  const handleProvinceChange = (province: string) => {
    setCity('');
    setProvince(province);

    // 海外的点过于离散，也需要特殊处理
    if (province === '海外' || province === '') {
      leafletContext.map.setView(DEFAULT_MAP_CENTER, province === '' ? 4 : 2);
      return;
    }

    const points: [number, number][] = clubs
      .filter((club) => club.province === province)
      .map(({ lat, lon }) => [+lat, +lon]);
    setMapViewCenter(points);
  };

  const handleCityChange = (city: string) => {
    setCity(city);

    // 同上，特殊处理
    if (city === '海外' || city === '') {
      leafletContext.map.setView(DEFAULT_MAP_CENTER, city === '' ? 4 : 2);
      setProvince(city === '' ? '' : '海外');
      return;
    }

    const { province } = clubs.find((c) => c.city === city)!;
    const points: [number, number][] = clubs
      .filter((club) => club.city === city)
      .map(({ lat, lon }) => [+lat, +lon]);
    setMapViewCenter(points, 12);
    setProvince(province);
  };

  return (
    <div className="absolute bottom-2 left-2 flex flex-row">
      <Select
        className="w-40 mr-2"
        value={province}
        onChange={handleProvinceChange}
        data={[{ label: '全部省份', value: '' }, ...provinces]}
      />

      <Select
        className="w-40"
        value={city}
        onChange={handleCityChange}
        data={[{ label: '全部地区', value: '' }, ...citys]}
      />
    </div>
  );
};

export default RegionSelect;
