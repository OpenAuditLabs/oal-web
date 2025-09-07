"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { UploadCloud, Upload, File, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface UploadCardProps {
  onFilesSelected?: (files: FileList) => void;
  /** Optional custom headline text shown when not dragging */
  headline?: string;
  /** Optional footer note shown when not dragging; pass empty string to hide */
  footerNote?: string | null;
}

export default function UploadCard({ onFilesSelected, headline, footerNote }: UploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [isGlobalDrag, setIsGlobalDrag] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to get file icon color based on extension
  const getFileIconColor = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'text-yellow-500';
      case 'ts':
      case 'tsx':
        return 'text-blue-500';
      case 'py':
        return 'text-green-500';
      case 'java':
        return 'text-orange-500';
      case 'php':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  // Handle file selection from both drop and input
  const handleFileSelection = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    if (onFilesSelected) {
      onFilesSelected(files);
    }
  };

  // Remove a specific file
  const removeFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    
    // Create new FileList-like object for callback
    if (onFilesSelected && updatedFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach(file => dataTransfer.items.add(file));
      onFilesSelected(dataTransfer.files);
    }
  };

  // Clear all files
  const clearFiles = () => {
    setSelectedFiles([]);
  };

  // Global drag handlers for the entire window
  useEffect(() => {
    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsGlobalDrag(true);
      }
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only hide overlay when leaving the entire window
      if (!e.relatedTarget || (e.relatedTarget as Element)?.nodeName === "HTML") {
        setIsGlobalDrag(false);
        setIsDragOver(false);
        setDragCounter(0);
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsGlobalDrag(false);
      setIsDragOver(false);
      setDragCounter(0);
    };

    window.addEventListener('dragenter', handleGlobalDragEnter);
    window.addEventListener('dragleave', handleGlobalDragLeave);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragenter', handleGlobalDragEnter);
      window.removeEventListener('dragleave', handleGlobalDragLeave);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);
    setIsGlobalDrag(false); // Reset global drag state
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <>
      {/* Global drag overlay */}
      {isGlobalDrag && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          style={{ 
            pointerEvents: 'none',
          }}
        />,
        document.body
      )}

      <div className={`rounded-xl p-8 relative transition-all duration-300 ${
        isGlobalDrag ? 'z-50 scale-[1.02] shadow-2xl' : ''
      }`}>
        <div className="bg-secondary rounded-lg p-6 mb-4">
          <div 
            className={`border-dashed-wide rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : isGlobalDrag
                ? 'border-primary/70 bg-primary/3'
                : 'hover:border-primary/50 hover:bg-primary/2'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
              isDragOver ? 'bg-primary/10' : isGlobalDrag ? 'bg-primary/5' : ''
            }`}>
              <UploadCloud className={`w-5 h-5 transition-colors duration-200 ${
                isDragOver || isGlobalDrag ? 'text-primary' : 'text-primary'
              }`} />
            </div>

      <p className={`text-foreground text-lg block mb-4 transition-colors duration-200 ${
              isDragOver ? 'text-primary' : isGlobalDrag ? 'text-primary/80' : ''
            }`}>
              {isDragOver 
                ? 'Drop files here to upload' 
                : isGlobalDrag 
        ? 'Drop files here to upload'
        : (headline || 'Upload a file to run a quick scan')
              }
      </p>

            <Button
              variant="primary"
              size="md"
              icon={Upload}
              asLabel={true}
              className="mb-4"
            >
              {isDragOver ? 'Drop Files' : isGlobalDrag ? 'Drop Files' : 'Add Files'}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleChange}
                multiple
                accept=".js,.ts,.jsx,.tsx,.py,.java,.php,.rb,.go,.rs,.cpp,.c,.cs,.swift,.kt,.dart"
              />
            </Button>
          
        
            {((footerNote ?? undefined) !== '' && !isDragOver && !isGlobalDrag) || (isDragOver || isGlobalDrag) ? (
              <p className={`text-sm text-muted-foreground text-center transition-colors duration-200 ${
                isDragOver ? 'text-primary/70' : isGlobalDrag ? 'text-primary/60' : ''
              }`}>
                {isDragOver || isGlobalDrag
                  ? 'Release to upload files'
                  : (footerNote ?? 'To upload multiple files, create a project')}
              </p>
            ) : null}
          </div>

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="mt-6 p-4 bg-card rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">
                  Selected Files ({selectedFiles.length})
                </h4>
                <button
                  onClick={clearFiles}
                  className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-secondary rounded-md group"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <File className={`w-4 h-4 flex-shrink-0 ${getFileIconColor(file.name)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-1 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
