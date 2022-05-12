import type { NextPage } from 'next';
import { IFrisbeeClubRecord, VikaFrisbeeDatabse } from '../database/vika';
import { AppShell, Container, Header } from '@mantine/core';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ClubType, clubTypesState, frisbeeClubsState } from '../store/state';
import { useEffect } from 'react';

const FrisbeeMap = dynamic(() => import('../components/FrisbeeMap'), {
  ssr: false,
});

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
  const clubTypes = useRecoilValue(clubTypesState);
  const setFrisbeeClubsState = useSetRecoilState(frisbeeClubsState);

  useEffect(() => {
    const clubs = records.filter(({ type }) => clubTypes.includes(type as ClubType));
    setFrisbeeClubsState(clubs);
  }, [records, clubTypes, setFrisbeeClubsState]);

  return (
    <AppShell
      header={
        <Header height={60}>
          <Container size="xl" py={5}>
            <Image src="/assets/logo.png" alt="logo" width={140} height={50} />
          </Container>
        </Header>
      }
    >
      <Container size="xl" px={0}>
        <FrisbeeMap className="w-full h-1/2screen min-h-96 z-0 shadow" />
      </Container>
    </AppShell>
  );
};

export default Home;
