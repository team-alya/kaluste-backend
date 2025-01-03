import { AnalyzerResult } from "../types/analyzer";
import { PriceEstimation } from "../types/schemas";

export const getMockFurnitureData = (): AnalyzerResult => {
  return {
    merkki: "Artek",
    malli: "Jakkara 60",
    vari: "Koivu",
    mitat: {
      pituus: 38,
      leveys: 38,
      korkeus: 44,
    },
    materiaalit: ["koivu", "vaneri"],
    kunto: "Hyvä",
  };
};

export const getMockPriceData = (): PriceEstimation => {
  return {
    korkein_hinta: 450,
    alin_hinta: 350,
    suositus_hinta: 400,
    arvioitu_myyntiaika: {
      nopea: 7,
      normaali: 30,
      hidas: 90,
    },
    myyntikanavat: ["Tori.fi", "Facebook Marketplace", "Huuto.net"],
    perustelu: [
      "Artek Jakkara 60 on klassikkotuote, jolla on vakiintunut kysyntä.",
      "Tuotteen kunto on hyvä ja materiaalit ovat laadukkaita.",
      "Koivuinen versio on suosittu värivaihtoehto.",
      "Markkinoilla on tasainen kysyntä designklassikoille.",
    ],
    markkinatilanne: {
      kysyntä: "korkea",
      kilpailu: 15,
      sesonki: false,
    },
  };
};
