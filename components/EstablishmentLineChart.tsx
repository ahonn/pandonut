import { Card, Skeleton } from '@mantine/core';
import React, { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import { frisbeeClubsState } from '../store/state';
import { IFrisbeeClubRecord } from '../database/vika';
import {
  ClubType,
  CLUB_TYPE_COLOR_MAP,
  CLUB_TYPE_LIST,
} from './common/club-type';

const EstablishmentLineChart = () => {
  const frisbeeClubs = useRecoilValue(frisbeeClubsState);

  const data = useMemo(() => {
    const groupByTime = frisbeeClubs.reduce((map, club) => {
      const year = dayjs(club.time, 'YYYY/MM/DD').year();
      if (!map[year]) {
        map[year] = [];
      }
      map[year].push(club);
      return map;
    }, {} as Record<string, IFrisbeeClubRecord[]>);

    return Object.keys(groupByTime)
      .map((year) => ({
        year,
        count: groupByTime[year].length,
        ...CLUB_TYPE_LIST.reduce((map, clubType) => {
          map[clubType] = groupByTime[year].filter(
            (club) => club.type === clubType,
          ).length;
          return map;
        }, {} as Record<ClubType, number>),
      }))
  }, [frisbeeClubs]);

  return (
    <Card className="my-4 shadow">
      <h2 className="text-xl mb-2 font-serif">俱乐部成立时间</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name="全部"
              stroke="#000000"
              fill="#000000"
            />
            {CLUB_TYPE_LIST.map((clubType) => (
              <Line
                key={clubType}
                dataKey={clubType}
                fill={CLUB_TYPE_COLOR_MAP[clubType]}
                stroke={CLUB_TYPE_COLOR_MAP[clubType]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EstablishmentLineChart;
