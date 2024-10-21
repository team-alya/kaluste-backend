import gemini from "../../configs/gemini";
import { FurnitureDetails, RepairAnalysisResponse } from "../../utils/types";

const createPrompt = (furnitureDetails: FurnitureDetails) => `
  Description of the piece of furniture in the photo:

  The type of the furniture is ${furnitureDetails.type}. The maker of the furniture is ${furnitureDetails.brand} and its model is ${furnitureDetails.model}.
  The color of the furniture is ${furnitureDetails.color}. The approximate dimensions are ${furnitureDetails.dimensions.length}x${furnitureDetails.dimensions.width}x${furnitureDetails.dimensions.height} cm.
  The condition is ${furnitureDetails.condition}. The age is ${furnitureDetails.age} years. 

  Give me instructions on how to restore/repair or recycle my piece of furniture, based on the description and photo provided to you. 
  If the furniture is in bad condition, give me instructions on how to restore/repair it, or if it's beyond repair, provide instructions on how to recycle it. 
  Pay close attention to the brand, material, age, condition, and defects. 
  Return instructions as a JSON object that has the fields repair_instructions, recycle_instructions, and suggestion. 
  In the repair_instructions field, provide instructions on how to repair this furniture piece if it is necessary. 
  In the recycle_instructions field, provide information on how to recycle this furniture in Finland. 
  In both repair_instructions and recycle_instructions field provide extensive step by step instructions with explanation.
  In the suggestion field, you need to suggest to the user what he/she should do with this furniture based on the information and picture given to you above. 
  Should the user repair/restore or recycle it? In the suggestion field, provide only your suggestion and not instructions like in the repair_instructions and recycle_instructions fields.
  Text in those fields should be without new lines. The format of you outputs should stay consistent.
  Format the response as a consistent JSON object.
`;

const parseRepairResponse = (responseText: string) => {
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanedText) as RepairAnalysisResponse;
};

const analyzeRepairEstimate = async (
  imageBase64: string,
  furnitureDetails: FurnitureDetails
) => {
  const prompt = createPrompt(furnitureDetails);

  try {
    const result = await gemini.model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);
    const response = result.response;
    const text = response.text();

    const parsedResponse = parseRepairResponse(text);
    return parsedResponse;
  } catch (error: unknown) {
    return {
      error: `An unexpected error occured during repair analysis. Message: ${
        (error as Error).message
      } `,
    };
  }
};

export default analyzeRepairEstimate;
