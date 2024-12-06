import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#1E1E2D] text-white w-full shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold">Stage-Based Prompt Generator</h1>
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-lg font-medium hover:text-[#47FFFF] transition-all">
            Dashboard
          </a>
          <a href="#" className="text-lg font-medium hover:text-[#FF47FF] transition-all">
            Documentation
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;