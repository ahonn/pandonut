import { atom, selector } from 'recoil';
import { ClubType } from '../components/common/club-type';
import { IFrisbeeClubRecord } from '../database/vika';

export const frisbeeClubsState = atom<IFrisbeeClubRecord[]>({
  key: 'frisbeeClubsState',
  default: [],
});

export const clubTypesState = atom<ClubType[]>({
  key: 'clubTypeState',
  default: [ClubType.Public, ClubType.School, ClubType.Women, ClubType.Teen],
});

export const provinceState = atom<string>({
  key: 'provinceState',
  default: '',
});

export const cityState = atom<string>({
  key: 'cityState',
  default: '',
});

export const provinceListState = selector<string[]>({
  key: 'provinceListState',
  get: ({ get }) => {
    const frisbeeClubs = get(frisbeeClubsState);
    return Array.from(new Set(frisbeeClubs.map((clubs) => clubs.province)));
  },
});

export const cityListState = selector<string[]>({
  key: 'cityListState',
  get: ({ get }) => {
    const frisbeeClubs = get(frisbeeClubsState);
    const province = get(provinceState);
    return Array.from(
      new Set(
        frisbeeClubs
          .filter((club) => !province || club.province === province)
          .map((club) => club.city),
      ),
    );
  },
});

