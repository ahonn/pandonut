import { BaseFrisbeeDatabase } from './base';
import { Vika } from "@vikadata/vika";
import { Datasheet } from '@vikadata/vika/es/datasheet';

export interface IFrisbeeClubRecord {
  fee: string;
  competive: string;
  address: string;
  lon: string;
  lat: string;
  name: string;
  contact: string;
  scale: string;
  city: string;
  type: string;
  province: string;
  time: number;
  coach: string;
}

export class VikaFrisbeeDatabse extends BaseFrisbeeDatabase<IFrisbeeClubRecord> {
  private vika: Vika;
  private datasheet: Datasheet;
  private static instance: VikaFrisbeeDatabse;

  constructor() {
    super();
    this.vika = new Vika({ token: process.env.VIKA_API_TOKEN! });
    this.datasheet = this.vika.datasheet(process.env.VIKA_DATASHEET!)
  }

  public static getInstance(): VikaFrisbeeDatabse {
    if (!VikaFrisbeeDatabse.instance) {
      VikaFrisbeeDatabse.instance = new VikaFrisbeeDatabse();
    }
    return VikaFrisbeeDatabse.instance;
  }

  // @ts-ignore
  public async queryAll(): Promise<IFrisbeeClubRecord[]> {
    const recordsIter = this.datasheet.records.queryAll({ viewId: process.env.VIKA_MAIN_VIEW_ID! });
    const records = [];
    for await (const eachPageRecords of recordsIter){
      const items = eachPageRecords.map(({ fields }) => fields);
      records.push(...items);
    }
    return records as unknown as IFrisbeeClubRecord[];
  }
}
