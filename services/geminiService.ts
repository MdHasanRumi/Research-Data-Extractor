import { GoogleGenAI } from "@google/genai";
import { ExtractedData } from "../types";
import { RESEARCH_DATA_SCHEMA } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractDataFromPdf = async (
  base64File: string,
  mimeType: string = "application/pdf"
): Promise<ExtractedData> => {
  try {
    const prompt = `
      You are an expert research assistant specializing in plant pathology and molecular biology.
      
      Analyze the provided research article PDF and extract specific metadata with high precision.
      
      Extract the following fields:
      - Title
      - Full Citation (APA Style)
      - DOI
      - Crop (Host plant)
      - Pathogen Name
      - Pathogen Type (e.g., Virus, Bacteria, Fungus)
      - Microbiome Type (e.g., Root, Soil, Stem)
      - Affected Plant Parts
      - Primer Name (Specific primers mentioned)
      - Database Used (e.g., NCBI, SILVA, UNITE)
      - Analysis Pipeline (Software/Bioinformatics tools)
      - Stat Tools (Statistical software)
      - Sequencing Platform (Hardware used for sequencing)

      If a specific piece of information is not explicitly stated or cannot be confidently inferred from the text, you MUST return the string "Not Available" for that field. Do not hallucinate data.
    `;

    // Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
    const cleanBase64 = base64File.replace(/^data:.+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using Pro for complex reasoning and extraction accuracy
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESEARCH_DATA_SCHEMA,
        thinkingConfig: {
            thinkingBudget: 1024, // Budgeting some tokens for reasoning to ensure accuracy
        }
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from Gemini.");
    }

    const data = JSON.parse(text) as ExtractedData;
    return data;
  } catch (error) {
    console.error("Error extracting data:", error);
    throw error;
  }
};
