export interface Equipement {
  id: number;
  marque: string;
  model: string;
  matricule: string;
  prixJournalier: number;
  ville: string;
  pays: string;
  description: string;
  categorie: string;
  idProprietaire: number;
  imageUrl: string;
  disponible: string;
}