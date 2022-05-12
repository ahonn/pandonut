import { Switch } from '@mantine/core';
import React from 'react';
import { useRecoilState } from 'recoil';
import { clubTypesState } from '../store/state';
import { ClubType, CLUB_TYPE_COLOR_MAP } from './common/club-type';

export interface ITypeSwitchProps {
  className?: string;
}

const CLUB_TYPE_SWITCH_LIST = [
  ClubType.Public,
  ClubType.School,
  ClubType.Women,
  ClubType.Teen,
];

const TypeSwitch: React.FC<ITypeSwitchProps> = (props) => {
  const { className } = props;
  const [clubTypes, setClubTypes] = useRecoilState<ClubType[]>(clubTypesState);

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: ClubType,
  ) => {
    const { checked } = event.target;
    if (checked) {
      setClubTypes([...clubTypes, type]);
    } else {
      setClubTypes(clubTypes.filter((t) => t !== type));
    }
  };

  return (
    <div className={`flex flex-col bg-white/50 p-2 rounded ${className}`}>
      {CLUB_TYPE_SWITCH_LIST.map((type) => (
        <Switch
          key={type}
          className="py-1"
          size="xs"
          label={type}
          checked={clubTypes.includes(type)}
          disabled={clubTypes.includes(type) && clubTypes.length === 1}
          onChange={(e) => handleSwitchChange(e, type)}
          sx={() => ({
            '.mantine-Switch-input:checked': {
              backgroundColor: CLUB_TYPE_COLOR_MAP[type],
              borderColor: CLUB_TYPE_COLOR_MAP[type],
            },
          })}
        />
      ))}
    </div>
  );
};

export default TypeSwitch;
