import { PilotData } from "./pilot-data.model";
import { ProducerData } from "./producer-data.model";

export interface AppUser {
    id?: number;
    username: string;
    fullName: string;
    role: 'PILOT' | 'PRODUCER';
    producerData?: ProducerData;
    pilotData?: PilotData;
  }

export { PilotData, ProducerData };
  