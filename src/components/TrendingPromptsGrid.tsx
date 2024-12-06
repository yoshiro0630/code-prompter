import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface PromptCard {
  title: string;
  price: string;
  image: string;
}

const TrendingPromptsGrid: React.FC = () => {
  const samplePrompts: PromptCard[] = [
    { title: 'Optimized Product Launch', price: '$4.99', image: 'https://picsum.photos/320/240' },
    { title: 'Marketing Campaign Prompt', price: '$3.99', image: 'https://picsum.photos/320/241' },
    { title: 'AI-Generated Art Prompt', price: '$2.99', image: 'https://picsum.photos/320/242' },
    { title: 'Custom Logo Creation', price: '$5.99', image: 'https://picsum.photos/320/243' },
  ];

  return (
    <section className="bg-[#2B2B3F] text-white py-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-[#47FFFF]">Trending Prompts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {samplePrompts.map((prompt, index) => (
            <div 
              key={index} 
              className="bg-[#1E1E2D] rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
            >
              <img
                src={prompt.image}
                alt={prompt.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{prompt.title}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-[#FF47FF]">{prompt.price}</span>
                  <button 
                    className="flex items-center px-4 py-2 bg-[#47FFFF] text-[#1E1E2D] rounded-lg hover:bg-[#7F47FF] hover:text-white transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingPromptsGrid;