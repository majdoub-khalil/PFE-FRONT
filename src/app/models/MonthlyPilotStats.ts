import { Prestation } from './prestation.model'; // if you have this already

export interface MonthlyPilotStats {
  id: number;
  pilotId: number;
  year: number;
  month: number;
  quantiteCumulee: number;
  quantiteCible: number;
  previsionnelOrange: number;
  productionKm: number;
  kmBloques: number;
  kmEnCours: number;
  raf: number;
  depassementPL: number;
  staffingPlanning: number;
  objectifsCommunPL: number;
  prestation: Prestation;
}
