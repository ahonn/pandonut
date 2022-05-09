import type { NextPage } from 'next';
import { useMemo } from 'react';
import { Map, Markers } from 'react-amap';
import { IFrisbeeClubRecord, VikaFrisbeeDatabse } from '../src/database/vika';

export async function getStaticProps() {
  const database = VikaFrisbeeDatabse.getInstance();
  const records = await database.queryAll();

  return {
    props: {
      records,
    },
  };
}

export interface IHomeProps {
  records: IFrisbeeClubRecord[];
}

const Home: NextPage<IHomeProps> = (props) => {
  const { records } = props;
  console.log(props);

  const markers = useMemo(() => {
    return records.map((record) => {
      return {
        position: {
          longitude: record.lon,
          latitude: record.lat,
        },
      };
    });
  }, [records]);

  return (
    <div>
      <div style={{ width: '100%', height: '400px' }}>
        <Map amapkey={'788e08def03f95c670944fe2c78fa76f'} mapStyle="blue_night">
          <Markers markers={markers} useCluster />
        </Map>
      </div>
    </div>
  );
};

export default Home;
