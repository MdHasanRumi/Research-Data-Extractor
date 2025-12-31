import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultTable } from './components/ResultTable';
import { extractDataFromPdf } from './services/geminiService';
import { ExtractionResult } from './types';
import { Activity, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    setIsProcessing(true);
    
    // Create initial pending entries for all files
    const newPendingResults: ExtractionResult[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      fileName: file.name,
      data: null,
      status: 'loading'
    }));

    // Add these to the top of the list
    setResults(prev => [...newPendingResults, ...prev]);

    // Process files
    // We process them individually but update state as they finish
    const promises = newPendingResults.map(async (pendingItem, index) => {
      const file = files[index];
      
      try {
        // Read file
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });

        // Extract Data
        const extractedData = await extractDataFromPdf(base64String);

        // Update successful result
        setResults(prevResults => 
          prevResults.map(res => 
            res.id === pendingItem.id 
              ? { ...res, data: extractedData, status: 'success' } 
              : res
          )
        );
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        
        // Update error result
        setResults(prevResults => 
          prevResults.map(res => 
            res.id === pendingItem.id 
              ? { 
                  ...res, 
                  status: 'error', 
                  errorMessage: 'Failed to extract data.',
                  data: null 
                } 
              : res
          )
        );
      }
    });

    try {
      await Promise.allSettled(promises);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        {results.length === 0 && !isProcessing && (
            <div className="text-center max-w-3xl mx-auto mb-12 mt-10">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-6">
                    <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Accelerate Your Research Review
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Upload your research papers (single or multiple) and let our AI instantly extract key methodological details, 
                    pathogen info, and statistical tools into a structured format.
                </p>
            </div>
        )}

        <FileUpload onFileSelect={handleFileSelect} isLoading={isProcessing} />
        
        <div className="mt-12">
            <ResultTable results={results} />
        </div>

        {results.length > 0 && (
            <div className="text-center mt-12 mb-8">
                 <button 
                    onClick={() => {
                        if (confirm("Clear all results?")) {
                            setResults([]);
                        }
                    }}
                    className="text-sm text-slate-400 hover:text-red-500 underline transition-colors"
                 >
                    Clear History
                 </button>
            </div>
        )}

      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Research extraction tool built for scientific efficiency.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
