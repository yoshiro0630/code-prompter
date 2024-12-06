import React, { useState } from 'react';
import { useAPIStore } from '../stores/apiStore';
import { ApiService } from '../services/api-service';
import { PromptGenerator } from '../services/prompt/prompt-generator';
import { toast } from 'react-hot-toast';

const PromptGenerationExample: React.FC = () => {
  const [prompts, setPrompts] = useState<string[]>([]);
  // const { configManager } = useAPIStore();
  
  const generatePrompts = async () => {
    const apiService = new ApiService();
    const generator = new PromptGenerator(apiService);
    
    // Example document
    const document = {
      content: 'Build a React application with TypeScript',
      sections: {
        overview: 'Modern web application using React and TypeScript',
        requirements: 'Type-safe components and state management'
      },
      metadata: {
        fileName: 'project-spec.md',
        fileType: 'md',
        fileSize: 1000,
        timestamp: new Date().toISOString()
      }
    };

    try {
      const stages = generator.getStages(document.content);
      
      // Generate prompts for each stage
      const generatedPrompts = await Promise.all(
        stages.map(stage => 
          generator.generatePrompt({
            documentId: document.content,
            stageId: stage.id,
            context: {
              customInstructions: 'Focus on TypeScript best practices'
            }
          })
        )
      );
      
      setPrompts(generatedPrompts.map(p => p.content));
    } catch (error) {
      console.error('Error generating prompts:', error);
      toast.error('Failed to generate prompts');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Prompt Generation Example</h2>
      
      <button
        onClick={generatePrompts}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Generate Prompts
      </button>
      
      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md">
            <pre className="whitespace-pre-wrap">{prompt}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptGenerationExample;