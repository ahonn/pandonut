import React from "react";
import { IFrisbeeClubRecord } from "../database/vika";

const FrisbeeClubContext = React.createContext<IFrisbeeClubRecord[]>([]);

export const FrisbeeClubProvider = FrisbeeClubContext.Provider;

const useFrisbeeClubContext = () => {
  const context = React.useContext(FrisbeeClubContext);
  return context;
};

export default useFrisbeeClubContext;
