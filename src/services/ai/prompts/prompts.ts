export const analyzeImagePrompt = `
Analysoi tämä suomalainen huonekalu ja täytä scheman kentät.

SÄÄNNÖT
**Merkki** ja **Malli** ovat kriittisiä kenttiä. Jos et ole 100% varma jommastakummasta, palauta siihen kenttään täsmälleen 'Ei tiedossa'. Älä arvaa.
`;

export const analyzeImagePromptEnglish = `
Analyze this Finnish furniture piece and fill in the schema fields.

RULES
**Brand** and **Model** are critical fields. If you are not 100% certain about either of them, return exactly 'Ei tiedossa' for that field. Do not guess.
`;

// Hieman erillainen tiukempi prompt Gemini15 mallille, koska antaa höpö höpö vastauksia muuten malliksi välillä.
export const analyzeImagePromptGemini15 =
  "Analyze this most likely scandinavian furniture piece and identify its details. Be extremely precise with the model identification - if you are not completely certain about any detail, return 'Ei tiedossa'. It is critical that you do not make assumptions or guesses about the model. It is better to return 'Ei tiedossa' than to risk misidentification.";

export const analyzeImagePromptGemini25 =
  "Analyze this most likely scandinavian furniture piece and identify its details. Be extremely precise with the model identification - if you are not completely certain about any detail, return 'Ei tiedossa'. It is critical that you do NOT make assumptions or guesses about the model. Many manufacturers produce similar furniture, so it is ESSENTIAL to return 'Ei tiedossa' rather than risk misidentification. DO NOT attempt to guess the model under any circumstances if you have even the slightest doubt.";

// GPT4o jättää kunnon aina ei tiedossa jos käytämme lopussa "Älä arvaa" ohjetta siksi oma prompt
export const analyzeImagePromptGPTO3 =
  "Tunnista tämän sisustustuotteen tiedot. Anna paras arvio merkistä ja mallista; jos et pysty päättelemään jotakin kenttää, palauta 'Ei tiedossa'.";
  
// Jos pipeline ei ole löytänyt vastausta kutsumme vielä kerran GPT4o uusinta mallia tällä promptilla ja pyydämme antamaan parhaan arvionsa huonekalun brändille vähintään
export const finalAnalyzePromptGPT4o = `Analysoi tämä huonekalu mahdollisimman tarkasti ja palauta valmistajan nimi merkki-kenttään. 

Tämä on viimeinen tunnistusyritys, joten anna aina jokin valmistajan nimi vähintään. Mallia ei tarvitse tunnistaa ellet ole varma, mutta anna paraus arvauksesi jos sinulla on hyvä epäilys - älä palauta "Ei tiedossa" merkille.

Älä mainitse että kyseessä on arvaus kuitenkaan.

Analyysin vaiheet:
1. Tutki huonekalun muotokieltä, materiaaleja ja yksityiskohtia
2. Vertaa näitä piirteitä tunnettuihin suomalaisiin ja pohjoismaisiin valmistajiin
3. Palauta parhaiten sopivan valmistajan nimi
`;

// Optimoitu prompt fine-tuning-käyttöön
export const analyzeImagePromptFineTuning =
  "Analysoi tämä huonekalu ja tunnista sen merkki ja malli. Vastaa JSON-muodossa ja käytä 'Ei tiedossa', jos et ole varma.";
