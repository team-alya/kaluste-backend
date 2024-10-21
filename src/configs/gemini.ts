import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../utils/constants";

const client = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

export default { model };
