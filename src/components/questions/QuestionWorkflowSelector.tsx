import React from 'react';
import { DocumentTextIcon, SparklesIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useAPIStore } from '../../stores/apiStore';
import { toast } from 'react-hot-toast';

interface QuestionWorkflowSelectorProps {
  onSelect: (type: 'fixed' | 'dynamic') => void;
  onBack: () => void;
}

const QuestionWorkflowSelector: React.FC<QuestionWorkflowSelectorProps> = ({ onSelect, onBack }) => {
  const { apiKey } = useAPIStore();

  const handleTestMode = () => {
    if (!apiKey) {
      toast.error('Please configure your API key first');
      useAPIStore.setState({ showAPISettings: true });
      return;
    }

    // Store test answers in localStorage
    const testAnswers = {
      question_0: "Build a modern e-commerce platform",
      question_1: "Product catalog, shopping cart, user accounts",
      question_2: "Clean and intuitive interface with responsive design",
      question_3: "React frontend with Node.js backend",
      question_4: "Cloud storage for product images and user data",
      question_5: "OAuth authentication and data encryption",
      question_6: "Agile development with weekly sprints",
      question_7: "3-month development timeline"
    };

    localStorage.setItem('test-answers', JSON.stringify(testAnswers));
    localStorage.setItem('use-test-answers', 'true');
    localStorage.setItem('test-project-type', 'website');
    
    // Skip directly to dynamic mode
    onSelect('dynamic');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Choose Question Type
      </h2>

      {/* Test Button */}
      <button
        onClick={handleTestMode}
        className="w-full p-6 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg text-white hover:shadow-lg transition-shadow text-left group relative overflow-hidden mb-4"
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="flex items-start space-x-4">
          <div className="bg-white/10 rounded-lg p-2">
            <BeakerIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Test Mode</h3>
            <p className="text-sm opacity-90">
              Skip questions and use sample data for testing
            </p>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('fixed')}
          className="p-6 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg text-white hover:shadow-lg transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 rounded-lg p-2">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Fixed Questions</h3>
              <p className="text-sm opacity-90">
                A predefined set of comprehensive questions covering all aspects of software development
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect('dynamic')}
          className="p-6 bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] rounded-lg text-white hover:shadow-lg transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 rounded-lg p-2">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Dynamic Questions</h3>
              <p className="text-sm opacity-90">
                AI-generated questions based on your project type and previous answers
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default QuestionWorkflowSelector;