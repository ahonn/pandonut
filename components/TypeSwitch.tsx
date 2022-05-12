import { Switch } from '@mantine/core';
import React from 'react';
import { useRecoilState } from 'recoil';
import { ClubType, clubTypesState } from '../store/state';

export interface ITypeSwitchProps {
  className?: string;
}

const TypeSwitch: React.FC<ITypeSwitchProps> = (props) => {
  const { className } = props;
  const [clubTypes, setClubTypes] = useRecoilState<ClubType[]>(clubTypesState);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, type: ClubType) => {
    const { checked } = event.target;
    if (checked) {
      setClubTypes([...clubTypes, type]);
    } else {
      setClubTypes(clubTypes.filter((t) => t !== type));
    }
  };

  return (
    <div className={`flex flex-col bg-white/50 p-2 rounded ${className}`}>
      <Switch
        className="pb-2"
        size="xs"
        label={ClubType.Public}
        checked={clubTypes.includes(ClubType.Public)}
        onChange={(e) => handleSwitchChange(e, ClubType.Public)}
      />
      <Switch
        className="pb-2"
        size="xs"
        label={ClubType.School}
        checked={clubTypes.includes(ClubType.School)}
        onChange={(e) => handleSwitchChange(e, ClubType.School)}
      />
      <Switch
        size="xs"
        label={ClubType.Women}
        checked={clubTypes.includes(ClubType.Women)}
        onChange={(e) => handleSwitchChange(e, ClubType.Women)}
      />
    </div>
  );
};

export default TypeSwitch;
