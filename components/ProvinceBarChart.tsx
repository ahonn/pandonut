import { Card } from '@mantine/core';
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useRecoilValue } from 'recoil';
import { IFrisbeeClubRecord } from '../database/vika';
import { frisbeeClubsState } from '../store/state';
import {
  ClubType,
  CLUB_TYPE_COLOR_MAP,
  CLUB_TYPE_LIST,
} from './common/club-type';

const ProvinceBarChart: React.FC = () => {
  const frisbeeClubs = useRecoilValue(frisbeeClubsState);

  const data = useMemo(() => {
    const groupByProvince = frisbeeClubs.reduce((map, club) => {
      if (!map[club.province]) {
        map[club.province] = [];
      }
      map[club.province].push(club);
      return map;
    }, {} as Record<string, IFrisbeeClubRecord[]>);

    return Object.keys(groupByProvince)
      .map((city) => ({
        name: city,
        count: groupByProvince[city].length,
        ...CLUB_TYPE_LIST.reduce((map, clubType) => {
          map[clubType] = groupByProvince[city].filter(
            (club) => club.type === clubType,
          ).length;
          return map;
        }, {} as Record<ClubType, number>),
      }))
      .sort((a, b) => b.count - a.count);
  }, [frisbeeClubs]);

  return (
    <Card className="my-4 shadow">
      <h2 className="text-xl mb-2 font-serif">各地区俱乐部数量</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%" className="-ml-6 py-2">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {CLUB_TYPE_LIST.map((clubType) => (
              <Bar
                key={clubType}
                dataKey={clubType}
                stackId="a"
                fill={CLUB_TYPE_COLOR_MAP[clubType]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProvinceBarChart;
