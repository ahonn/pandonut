import React, { useCallback, useEffect } from 'react';
import { Select } from '@mantine/core';
import * as turf from '@turf/turf';
import { useLeafletContext } from '@react-leaflet/core';
import { DEFAULT_MAP_CENTER } from './FrisbeeMap';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  cityListState,
  cityState,
  frisbeeClubsState,
  provinceListState,
  provinceState,
} from '../store/state';

export interface IRegionSelectProps {
  className?: string;
}

const RegionSelect: React.FC<IRegionSelectProps> = (props) => {
  const { className } = props;
  const [province, setProvince] = useRecoilState(provinceState);
  const [city, setCity] = useRecoilState(cityState);
  const clubs = useRecoilValue(frisbeeClubsState);
  const provinceList = useRecoilValue(provinceListState);
  const cityList = useRecoilValue(cityListState);
  const leafletContext = useLeafletContext();

  const setMapViewCenter = useCallback(
    (points: [number, number][], zoom = 8) => {
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
    },
    [leafletContext.map],
  );

  useEffect(() => {
    if (city !== '') {
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

      return;
    }

    // 海外的点过于离散，也需要特殊处理
    if (province === '海外' || province === '') {
      leafletContext.map.setView(DEFAULT_MAP_CENTER, province === '' ? 4 : 2);
      return;
    }

    const points: [number, number][] = clubs
      .filter((club) => club.province === province)
      .map(({ lat, lon }) => [+lat, +lon]);
    setMapViewCenter(points);
  }, [province, city, clubs, setMapViewCenter, leafletContext.map, setProvince]);

  const handleProvinceChange = (province: string) => {
    setCity('');
    setProvince(province);
  };

  const handleCityChange = (city: string) => {
    setCity(city);
  };

  return (
    <div className={`flex flex-row ${className}`}>
      <Select
        className="w-32 mr-2"
        value={province}
        onChange={handleProvinceChange}
        data={[{ label: '全部省份', value: '' }, ...provinceList]}
      />

      <Select
        className="w-32"
        value={city}
        onChange={handleCityChange}
        data={[{ label: '全部地区', value: '' }, ...cityList]}
      />
    </div>
  );
};

export default RegionSelect;
