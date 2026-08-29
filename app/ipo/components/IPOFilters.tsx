'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface IPOFiltersProps {
  currentParams: {
    status?: string;
    type?: string;
    category?: string;
    search?: string;
    sort?: string;
  };
}

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'closed', label: 'Closed' },
  { value: 'listed', label: 'Listed' },
];

const types = [
  { value: 'all', label: 'All Types' },
  { value: 'mainboard', label: 'Mainboard' },
  { value: 'sme', label: 'SME' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'gmp_desc', label: 'GMP: High to Low' },
  { value: 'gmp_asc', label: 'GMP: Low to High' },
  { value: 'sub_desc', label: 'Subscription: High to Low' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'open_date_desc', label: 'Opening Soon' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

export default function IPOFilters({ currentParams }: IPOFiltersProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(currentParams.search || '');

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams();
    
    // Keep existing params
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== key && v) params.set(k, v);
    });
    
    // Set new value
    if (value && value !== 'all') {
      params.set(key, value);
    }
    
    router.push(`/ipo?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchQuery);
  };

  return (
    <div className="card mb-8">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search IPO by company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline whitespace-nowrap"
        >
          <Filter className="w-5 h-5" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </form>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={currentParams.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={currentParams.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={currentParams.sort || 'newest'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
