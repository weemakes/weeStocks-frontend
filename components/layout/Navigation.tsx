'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center font-bold text-xl text-white group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
              W
            </div>
            <span className="text-xl font-bold text-white">WeeStox</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="transition-colors font-medium">
              Home
            </Link>

            {/* Stocks Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('stocks')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-white transition-colors font-medium">
                Stocks <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'stocks' && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2">
                    <Link href="/stocks" className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors">
                      Halal Screener
                    </Link>
                    <Link href="/stocks/top" className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors">
                      Top Halal Stocks
                    </Link>
                    <Link href="/stocks/analysis" className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors">
                      Stock Analysis
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Metals Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('metals')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-white transition-colors font-medium">
                Metals <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'metals' && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2">
                    <Link href="/gold/agra" className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors">
                      Gold Rates
                    </Link>
                    <Link href="/silver/agra" className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors">
                      Silver Rates
                    </Link>
                    <Link href="/platinum/agra" className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors">
                      Platinum Rates
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/ipo" className="text-gray-300 hover:text-blue-500 transition-colors font-medium">
              IPOs
            </Link>

            <Link href="/zakat" className="text-gray-300 hover:text-blue-500 transition-colors font-medium">
              Zakat & Guide
            </Link>

            <Link href="/about" className="text-gray-300 hover:text-blue-500 transition-colors font-medium">
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-300 hover:text-blue-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="btn btn-primary">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                Home
              </Link>
              <Link href="/stocks" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                Halal Stocks
              </Link>
              <Link href="/gold/agra" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                Gold Rates
              </Link>
              <Link href="/silver/agra" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                Silver Rates
              </Link>
              <Link href="/platinum/agra" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                Platinum Rates
              </Link>
              <Link href="/ipo" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                IPOs
              </Link>
              <Link href="/zakat" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                Zakat & Guide
              </Link>
              <Link href="/about" className="px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-blue-500 rounded transition-colors">
                About
              </Link>
              <div className="px-4 pt-2">
                <button className="btn btn-primary w-full">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
