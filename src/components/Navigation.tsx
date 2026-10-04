import React, { useState } from 'react';
import { Compass, BookOpen, BarChart3, Plus, Menu, X, ArrowUpRight } from 'lucide-react';

export type ActiveTab = 'home' | 'decisions' | 'insights' | 'new-decision';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewDecision: () => void;
  decisionsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onNewDecision,
  decisionsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#E8E8E3] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleNav('home')}
            className="group flex items-center space-x-2 text-left cursor-pointer focus:outline-none"
          >
            <span className="font-editorial text-2xl font-normal tracking-tight text-[#1C1C1A] group-hover:text-indigo-900 transition-colors">
              MUSE
            </span>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#7C7C74] font-medium pl-2 border-l border-[#DCDCD6]">
              Decision Journal
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'home'
                  ? 'text-[#1C1C1A] bg-[#EFEFEA]'
                  : 'text-[#6C6C64] hover:text-[#1C1C1A] hover:bg-[#F2F2ED]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNav('decisions')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide flex items-center space-x-1.5 transition-colors ${
                activeTab === 'decisions'
                  ? 'text-[#1C1C1A] bg-[#EFEFEA]'
                  : 'text-[#6C6C64] hover:text-[#1C1C1A] hover:bg-[#F2F2ED]'
              }`}
            >
              <span>Decisions</span>
              <span className="text-[10px] bg-[#E8E8E2] text-[#55554E] px-1.5 py-0.5 rounded-full font-mono">
                {decisionsCount}
              </span>
            </button>
            <button
              onClick={() => handleNav('insights')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'insights'
                  ? 'text-[#1C1C1A] bg-[#EFEFEA]'
                  : 'text-[#6C6C64] hover:text-[#1C1C1A] hover:bg-[#F2F2ED]'
              }`}
            >
              Insights
            </button>
          </nav>
        </div>

        {/* Right side action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              onNewDecision();
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-1.5 bg-[#2B2B28] hover:bg-[#1A1A18] text-[#FAF9F5] px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Decision</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#5A5A52] hover:text-[#1C1C1A] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E8E3] bg-[#F7F7F4] px-4 py-3 space-y-1">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'home' ? 'bg-[#EAEAE4] text-[#1C1C1A]' : 'text-[#5C5C54]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNav('decisions')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
              activeTab === 'decisions' ? 'bg-[#EAEAE4] text-[#1C1C1A]' : 'text-[#5C5C54]'
            }`}
          >
            <span>Decisions</span>
            <span className="text-xs bg-[#E0E0DA] px-2 py-0.5 rounded-full font-mono">
              {decisionsCount}
            </span>
          </button>
          <button
            onClick={() => handleNav('insights')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'insights' ? 'bg-[#EAEAE4] text-[#1C1C1A]' : 'text-[#5C5C54]'
            }`}
          >
            Insights & Calibration
          </button>
        </div>
      )}
    </header>
  );
};
