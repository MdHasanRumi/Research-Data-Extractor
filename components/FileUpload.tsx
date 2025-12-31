import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const filesArray = Array.from(fileList);
    const validFiles = filesArray.filter(file => file.type === "application/pdf");
    
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
    
    if (validFiles.length !== filesArray.length) {
      alert("Some files were ignored because they are not valid PDFs.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    processFiles(e.target.files);
    // Reset value so same files can be selected again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div 
        className={`relative group flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive 
            ? "border-indigo-500 bg-indigo-50 scale-[1.01]" 
            : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50"
          }
          ${isLoading ? "opacity-75 cursor-wait" : "cursor-pointer"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isLoading ? onButtonClick : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          multiple
          onChange={handleChange}
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isLoading ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 blur-xl rounded-full opacity-50 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-700">Processing Files...</p>
              <p className="text-sm text-slate-500 mt-2">Extracting data in background</p>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full mb-4 transition-colors ${dragActive ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
                <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
              </div>
              <p className="mb-2 text-lg font-medium text-slate-700">
                <span className="font-bold text-indigo-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Upload one or multiple research articles (PDF).
              </p>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-start gap-3 mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
            <p className="font-semibold">Note on Accuracy</p>
            <p>The system uses advanced AI to read the paper. While highly accurate, always verify the extracted data against the original PDF.</p>
            </div>
      </div>
    </div>
  );
};
