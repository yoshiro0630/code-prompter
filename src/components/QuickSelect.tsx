import React from 'react';
import { DocumentTextIcon, CodeBracketIcon, PencilSquareIcon, VideoCameraIcon, ChatBubbleBottomCenterTextIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useAPIStore } from '../stores/apiStore';
import { toast } from 'react-hot-toast';

interface QuickSelectCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const categories: QuickSelectCategory[] = [
  {
    id: 'bolt',
    title: 'Bolt.NEW Prompts',
    description: 'Generate stage-based prompts for building complex web apps',
    icon: <DocumentTextIcon className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-[#FF47FF] to-[#47FFFF]'
  },
  {
    id: 'code',
    title: 'Coding Prompts',
    description: 'Create prompts for efficient coding and debugging',
    icon: <CodeBracketIcon className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-[#47FFFF] to-[#7F47FF]'
  },
  {
    id: 'blog',
    title: 'Blog Creation',
    description: 'Generate engaging content and outlines for blogs',
    icon: <PencilSquareIcon className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-[#7F47FF] to-[#FF47FF]'
  },
  {
    id: 'video',
    title: 'Video Scripts',
    description: 'Write structured scripts for your video projects',
    icon: <VideoCameraIcon className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-[#FF8888] to-[#FFD700]'
  },
  {
    id: 'review',
    title: 'Review Responses',
    description: 'Draft professional responses for customer reviews',
    icon: <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-[#FFD700] to-[#FF47FF]'
  }
];

interface QuickSelectProps {
  onSelect: (category: string) => void;
}

const QuickSelect: React.FC<QuickSelectProps> = ({ onSelect }) => {
  const handleQuickTest = () => {
    // Test data
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

    // Store test data
    localStorage.setItem('test-answers', JSON.stringify(testAnswers));
    localStorage.setItem('test-project-type', 'website');
    localStorage.setItem('use-test-answers', 'true');

    // Notify user
    toast.success('Quick test mode activated');
    
    // Trigger selection
    onSelect('bolt-test');
  };

  return (
    <div className="p-4">
      {/* Test Button */}
      <div className="mb-6">
        <button
          onClick={handleQuickTest}
          className="w-full px-4 py-3 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <BeakerIcon className="h-5 w-5" />
          <span>Quick Test (Skip Questions)</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`${category.color} p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 rounded-lg p-2">
                {category.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {category.title}
                </h3>
                <p className="text-sm text-white/80">
                  {category.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSelect;