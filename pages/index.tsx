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
      <div className="-m-4">
        <FrisbeeMap className="w-screen h-1/3screen min-h-96" data={records} province={null} />
      </div>
    </AppShell>
  );
};

export default Home;
