export interface FurnitureDetails {
  merkki: string;
  malli: string;
  väri: string;
  mitat: {
    pituus: number;
    leveys: number;
    korkeus: number;
  };
  materiaalit: string[];
  kunto: string;
}

export interface PriceAnalysisResponse {
  korkein_hinta: number;
  alin_hinta: number;
  myyntikanavat: string[];
}

export interface RepairAnalysisResponse {
  korjaus_ohjeet: string;
  kierrätys_ohjeet: string;
}

export interface ToriPrices {
   [key: string]: [number, number];
}