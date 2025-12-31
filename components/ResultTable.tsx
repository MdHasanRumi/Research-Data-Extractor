import React from 'react';
import { Copy, Check, FileText, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { ExtractionResult } from '../types';

interface ResultTableProps {
  results: ExtractionResult[];
}

export const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (results.length === 0) return null;

  const copyToClipboard = (result: ExtractionResult) => {
    if (!result.data) return;
    
    // Values matching the requested order
    const values = [
      result.data.title,
      result.data.fullCitation,
      result.data.doi,
      result.data.crop,
      result.data.pathogenName,
      result.data.pathogenType,
      result.data.microbiomeType,
      result.data.affectedPlantParts,
      result.data.primerName,
      result.data.databaseUsed,
      result.data.analysisPipeline,
      result.data.statTools,
      result.data.sequencingPlatform
    ];

    // Format for Excel/Sheets (Tab separated)
    const tsvContent = values.join('\t');
    
    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopiedId(result.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const renderCell = (label: string, value: string) => (
      <div className="py-3 border-b border-slate-100 last:border-0 grid grid-cols-12 gap-4">
          <div className="col-span-4 sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-slate-500 pt-1">
              {label}
          </div>
          <div className="col-span-8 sm:col-span-8 text-sm text-slate-800 font-medium break-words">
              {value === "Not Available" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                      Not Available
                  </span>
              ) : value}
          </div>
      </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-indigo-600" />
        Extracted Data ({results.length})
      </h2>
      
      <div className="space-y-8">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
            
            {/* Card Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
                        {result.status === 'loading' ? (
                             <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        ) : result.status === 'error' ? (
                             <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                             <FileText className="w-5 h-5 text-indigo-600" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate" title={result.fileName}>{result.fileName}</h3>
                        <p className={`text-xs ${result.status === 'error' ? 'text-red-500' : 'text-slate-500'}`}>
                            {result.status === 'loading' ? 'Processing...' : result.status === 'error' ? result.errorMessage : 'Processed successfully'}
                        </p>
                    </div>
                </div>
                
                {result.status === 'success' && result.data && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {result.data.doi && result.data.doi !== "Not Available" && (
                            <a 
                                href={`https://doi.org/${result.data.doi}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open DOI
                            </a>
                        )}
                        <button
                            onClick={() => copyToClipboard(result)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                                ${copiedId === result.id 
                                    ? 'bg-green-600 text-white border border-transparent' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent'
                                }`}
                        >
                            {copiedId === result.id ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied Row
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Data
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Card Content - Data Grid */}
            {result.status === 'success' && result.data && (
                <div className="p-6">
                    {/* Primary Info Block */}
                    <div className="mb-6 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                         <div className="grid grid-cols-1 gap-4">
                            <div>
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Article Title</span>
                                <p className="text-lg font-serif font-medium text-slate-900 leading-snug">{result.data.title}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Full Citation</span>
                                <p className="text-sm text-slate-700 italic">{result.data.fullCitation}</p>
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                        <div className="flex flex-col">
                            {renderCell("DOI", result.data.doi)}
                            {renderCell("Crop", result.data.crop)}
                            {renderCell("Pathogen Name", result.data.pathogenName)}
                            {renderCell("Pathogen Type", result.data.pathogenType)}
                            {renderCell("Microbiome Type", result.data.microbiomeType)}
                        </div>
                        <div className="flex flex-col">
                            {renderCell("Affected Parts", result.data.affectedPlantParts)}
                            {renderCell("Primer Name", result.data.primerName)}
                            {renderCell("Database Used", result.data.databaseUsed)}
                            {renderCell("Analysis Pipeline", result.data.analysisPipeline)}
                            {renderCell("Stat Tools", result.data.statTools)}
                            {renderCell("Sequencing Platform", result.data.sequencingPlatform)}
                        </div>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
