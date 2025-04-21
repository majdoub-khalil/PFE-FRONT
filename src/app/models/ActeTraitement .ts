import { Prestation } from './prestation.model';

export interface ActeTraitement {
  idacte: number;
  date_facturation: string;
  affectation: string; // This should be matched to user.id
  commentaire: string;
  date_deadline: string;
  date_livraison: string;
  date_reception: string;
  date_reprise: string;
  date_validation: string;
  duree: number;
  motif: string;
  priorite: string;
  quantite: number;
  reprise_facturable: boolean;
  statut_facturation: string;
  type_element: string;
  is_deleted: boolean;
  classification: string;

  prestation: Prestation;
}
