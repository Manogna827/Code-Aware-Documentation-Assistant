"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function Sidebar() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track uploaded files in the current session for UI purposes
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file.");
      }

      setUploadedFiles(prev => [...prev, file.name]);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="w-80 h-full bg-slate-900 text-slate-100 flex flex-col border-r border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
          <FileText className="text-blue-400" />
          Knowledge Base
        </h2>
        <p className="text-sm text-slate-400">
          Upload TXT, MD, or CSV files to add them to MongoDB Atlas.
        </p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <label 
            htmlFor="file-upload" 
            className={`
              flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed rounded-xl cursor-pointer 
              transition-all duration-200
              ${isUploading ? 'border-slate-600 bg-slate-800' : 'border-blue-500/50 hover:bg-slate-800 hover:border-blue-400'}
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                  <p className="text-sm text-slate-400">Processing & Saving...</p>
                  <p className="text-xs text-slate-500 mt-1">Extracting, embedding, indexing.</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-blue-400 mb-2" />
                  <p className="mb-1 text-sm text-slate-300">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">TXT, MD, CSV</p>
                </>
              )}
            </div>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept=".txt,.md,.csv" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Uploaded This Session ({uploadedFiles.length})
          </h3>
          
          {uploadedFiles.length === 0 ? (
            <div className="text-center p-4 bg-slate-800/50 rounded-lg text-slate-500 text-sm border border-slate-700 border-dashed">
              Your database may already have documents from previous sessions.
            </div>
          ) : (
            <ul className="space-y-2">
              {uploadedFiles.map((source, idx) => (
                <li key={idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-200 truncate" title={source}>
                    {source}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-500 text-center">
        Powered by <strong className="text-slate-300">MongoDB Atlas Vector Search</strong>
        <br/>& LangChain
      </div>
    </div>
  );
}
