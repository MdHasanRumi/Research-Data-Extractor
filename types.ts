export interface ExtractedData {
  title: string;
  fullCitation: string;
  doi: string;
  crop: string;
  pathogenName: string;
  pathogenType: string;
  microbiomeType: string;
  affectedPlantParts: string;
  primerName: string;
  databaseUsed: string;
  analysisPipeline: string;
  statTools: string;
  sequencingPlatform: string;
}

export interface ExtractionResult {
  id: string;
  fileName: string;
  data: ExtractedData | null;
  status: 'pending' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
