import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { IFrisbeeClubRecord, VikaFrisbeeDatabse } from '../database/vika';
import {
  AppShell,
  Card,
  Container,
  Header,
  Select,
  SimpleGrid,
} from '@mantine/core';
import Image from 'next/image';
import dynamic from 'next/dynamic'

const FrisbeeMap = dynamic(
  () => import('../components/FrisbeeMap'),
  { ssr: false }
)

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
  const [selectedProvince, setSelectedProvince] = useState<string | null>('');

  const provinces = useMemo(
    () => Array.from(new Set(records.map((record) => record.province))),
    [records],
  );

  const citys = useMemo(
    () =>
      Array.from(
        new Set(
          records
            .filter((record) => record.province === selectedProvince)
            .map((record) => record.city),
        ),
      ),
    [records, selectedProvince],
  );

  return (
    <AppShell
      header={
        <Header height={60}>
          <Container py={5}>
            <Image src="/logo.png" alt="logo" width={140} height={50} />
          </Container>
        </Header>
      }
    >
      <Container>
        <Card shadow="md" withBorder>
          <SimpleGrid cols={3}>
            <Select
              placeholder="Province"
              value={selectedProvince}
              onChange={setSelectedProvince}
              data={provinces.map((province) => ({
                label: province,
                value: province,
              }))}
            />
            <Select
              placeholder="City"
              data={citys.map((city) => ({
                label: city,
                value: city,
              }))}
            />
          </SimpleGrid>

          <div className="pt-4">
            <FrisbeeMap data={records} province={selectedProvince} />
          </div>
        </Card>
      </Container>
    </AppShell>
  );
};

export default Home;
