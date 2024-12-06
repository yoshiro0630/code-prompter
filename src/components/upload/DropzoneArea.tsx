import React from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface DropzoneAreaProps {
  onDrop: (acceptedFiles: File[]) => void;
  isProcessing: boolean;
  supportedTypes: string[];
}

const DropzoneArea: React.FC<DropzoneAreaProps> = ({ 
  onDrop, 
  isProcessing, 
  supportedTypes 
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-[#47FFFF] bg-[#1E1E2D]/50' : 'border-gray-600 hover:border-[#FF47FF]'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-300">
        {isProcessing ? (
          'Processing document...'
        ) : isDragActive ? (
          'Drop your document here...'
        ) : (
          <>
            Drag and drop your document, or <span className="text-[#47FFFF]">browse</span>
            <br />
            <span className="text-xs text-gray-400">
              Supported formats: {supportedTypes.join(', ')}
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default DropzoneArea;