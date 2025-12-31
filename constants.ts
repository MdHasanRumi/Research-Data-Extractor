import { Type, Schema } from "@google/genai";

export const RESEARCH_DATA_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The full title of the research article.",
    },
    fullCitation: {
      type: Type.STRING,
      description: "The full citation of the article in APA format.",
    },
    doi: {
      type: Type.STRING,
      description: "The Digital Object Identifier (DOI) of the article.",
    },
    crop: {
      type: Type.STRING,
      description: "The specific crop or plant host studied.",
    },
    pathogenName: {
      type: Type.STRING,
      description: "The scientific name of the pathogen(s) studied.",
    },
    pathogenType: {
      type: Type.STRING,
      description: "The type of pathogen (e.g., Fungal, Bacterial, Viral, Nematode).",
    },
    microbiomeType: {
      type: Type.STRING,
      description: "The Microbiome Type (e.g. Root, Soil, Stem) or sample source.",
    },
    affectedPlantParts: {
      type: Type.STRING,
      description: "The parts of the plant affected (e.g., Leaves, Roots, Stem).",
    },
    primerName: {
      type: Type.STRING,
      description: "Names of specific primers used for PCR/sequencing.",
    },
    databaseUsed: {
      type: Type.STRING,
      description: "Reference databases used (e.g., NCBI GenBank, UNITE, SILVA, Greengenes).",
    },
    analysisPipeline: {
      type: Type.STRING,
      description: "Bioinformatics pipelines or software used for analysis.",
    },
    statTools: {
      type: Type.STRING,
      description: "Statistical tools or software used (e.g., R, SPSS, SAS).",
    },
    sequencingPlatform: {
      type: Type.STRING,
      description: "The sequencing platform used (e.g., Illumina MiSeq, Sanger, Nanopore).",
    },
  },
  required: [
    "title",
    "fullCitation",
    "doi",
    "crop",
    "pathogenName",
    "pathogenType",
    "microbiomeType",
    "affectedPlantParts",
    "primerName",
    "databaseUsed",
    "analysisPipeline",
    "statTools",
    "sequencingPlatform",
  ],
};

export const NOT_AVAILABLE_TEXT = "Not Available";
