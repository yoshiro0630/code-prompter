import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  supportedTypes: string[];
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload, supportedTypes }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-[#47FFFF] bg-[#1E1E2D]/50' : 'border-gray-600 hover:border-[#FF47FF]'
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14m-16 6v20m0-20L8 14m16 0l16 0"
          />
        </svg>
        <div className="text-gray-300">
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <>
              <p>Drag and drop your document here, or click to select</p>
              <p className="text-sm text-gray-400 mt-1">
                Supported formats: {supportedTypes.join(', ')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;