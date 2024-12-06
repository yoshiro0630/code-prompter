import React, { useState, useRef, useEffect } from 'react';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProcessingIndicator from './ProcessingIndicator';
import { useAPIStore } from '../stores/apiStore';
import { useProjectStore } from '../stores/projectStore';
import { ProjectPromptService } from '../services/prompt/projectPromptService';
import { toast } from 'react-hot-toast';
import { DocumentContent } from '../types/document-types';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  description: string;
}

interface DocumentUploadProps {
  onDocumentProcess: (content: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentProcess}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 'analyzing', label: 'Analyzing Document', status: 'pending', description: 'Analyzing Document' },
    { id: 'extracting', label: 'Extracting Requirements', status: 'pending', description: 'Extracting Requirements' },
    { id: 'generating', label: 'Generating Prompts', status: 'pending', description: 'Generating Prompts' },
    { id: 'formatting', label: 'Formatting Output', status: 'pending', description: 'Formatting Output' }
  ]);
  const [error, setError] = useState<string | undefined>();
  const [currentDocument, setCurrentDocument] = useState<DocumentContent | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { apiKey } = useAPIStore();
  const { currentProject, getDocument, saveDocument } = useProjectStore();

  useEffect(() => {
    if (currentProject) {
      loadDocument();
    }
  }, [currentProject]);

  const loadDocument = async () => {
    if (!currentProject) return;
    const doc = await getDocument(currentProject);
    setCurrentDocument(doc);
  };

  const updateStepStatus = (stepId: string, status: ProcessingStep['status'], stepProgress?: number) => {
    setProcessingSteps(steps => 
      steps.map(step => 
        step.id === stepId 
          ? { ...step, status, progress: stepProgress }
          : step
      )
    );
  };

  const handleFile = async (file: File) => {
    if (!apiKey) {
      toast.error('Please configure your API key first');
      useAPIStore.setState({ showAPISettings: true });
      return;
    }

    if (!currentProject) {
      toast.error('Please select or create a project first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(undefined);
    
    try {
      // Step 1: Analyze Document
      setCurrentStep('analyzing');
      updateStepStatus('analyzing', 'processing');
      setProgress(10);
      
      const content = await file.text();
      const document: DocumentContent = {
        content,
        rawContent: '',
        metadata: {
          fileName: file.name,
          fileType: file.name.split('.').pop() || 'txt',
          fileSize: file.size,
          timestamp: new Date().toISOString()
        }
      };

      updateStepStatus('analyzing', 'completed');
      setProgress(25);

      // Step 2: Extract Requirements
      setCurrentStep('extracting');
      updateStepStatus('extracting', 'processing');
      setProgress(30);
      
      await saveDocument(currentProject, document);
      setCurrentDocument(document);
      updateStepStatus('extracting', 'completed');
      setProgress(50);

      // Step 3: Generate Prompts
      setCurrentStep('generating');
      updateStepStatus('generating', 'processing');
      setProgress(60);

      await ProjectPromptService.processDocument(
        currentProject,
        document,
        undefined,
        (stage, progress) => {
          setCurrentStep(stage);
          setProgress(progress);
          
          const stepId = stage === 'analyzing' ? 'analyzing'
            : stage === 'extracting' ? 'extracting'
            : stage === 'generating' ? 'generating'
            : 'formatting';
            
          updateStepStatus(stepId, 'processing', progress);
          
          const stepOrder = ['analyzing', 'extracting', 'generating', 'formatting'];
          const currentIndex = stepOrder.indexOf(stepId);
          stepOrder.slice(0, currentIndex).forEach(id => {
            updateStepStatus(id, 'completed', 100);
          });
        }
      );

      updateStepStatus('generating', 'completed');
      setProgress(85);

      // Step 4: Format Output
      setCurrentStep('formatting');
      updateStepStatus('formatting', 'processing');
      setProgress(90);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStepStatus('formatting', 'completed');
      setProgress(100);

      toast.success('Document processed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      
      const currentStepObj = processingSteps.find(step => step.status === 'processing');
      if (currentStepObj) {
        updateStepStatus(currentStepObj.id, 'error');
      }

      toast.error('Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleDeleteDocument = async () => {
    if (!currentProject) return;

    const confirmed = window.confirm('Are you sure you want to delete the uploaded document? This will reset all generated prompts.');
    if (confirmed) {
      const emptyDocument: DocumentContent = {
        content: '',
        rawContent: '',
        metadata: {
          fileName: '',
          fileType: '',
          fileSize: 0,
          timestamp: new Date().toISOString()
        }
      };
      await saveDocument(currentProject, emptyDocument);
      setCurrentDocument(null);
      toast.success('Document deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      {currentDocument?.metadata.fileName && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currentDocument.metadata.fileName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Uploaded {new Date(currentDocument.metadata.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleDeleteDocument}
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Delete document"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {!currentDocument?.metadata.fileName && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-[#47FFFF] bg-[#1E1E2D]/50' : 'border-gray-600 hover:border-[#FF47FF]'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".txt,.md,.pdf"
            onChange={handleFileSelect}
            disabled={isProcessing}
          />
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-300">
            {isProcessing ? (
              'Processing document...'
            ) : isDragging ? (
              'Drop your document here...'
            ) : (
              <>
                Drag and drop your document, or <span className="text-[#47FFFF]">browse</span>
                <br />
                <span className="text-xs text-gray-400">
                  Supported formats: PDF, TXT, MD
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {isProcessing && (
        <ProcessingIndicator 
          stage="Processing Document"
          progress={progress}
          steps={processingSteps}
          currentStep={currentStep}
          error={error}
        />
      )}
    </div>
  );
};

export default DocumentUpload;