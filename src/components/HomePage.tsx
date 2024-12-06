import React from 'react';
import ProjectList from './ProjectList';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] bg-clip-text text-transparent">
              BOLT.NEW Projects
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ProjectList />
      </main>
    </div>
  );
};

export default HomePage;