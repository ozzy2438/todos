import React from 'react';
import { Tag, Clock, CheckCircle2 } from 'lucide-react';
import type { Category } from '../types/todo';

interface FilterPanelProps {
  filters: {
    category: string | null;
    timeFrame: 'today' | 'week' | 'month' | null;
    status: 'completed' | 'active' | null;
  };
  setFilters: {
    setCategory: (category: string | null) => void;
    setTimeFrame: (timeFrame: 'today' | 'week' | 'month' | null) => void;
    setStatus: (status: 'completed' | 'active' | null) => void;
  };
}

export function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  const categories: { name: Category; color: string }[] = [
    { name: 'work', color: 'bg-blue-100 text-blue-800' },
    { name: 'personal', color: 'bg-purple-100 text-purple-800' },
    { name: 'health', color: 'bg-green-100 text-green-800' },
    { name: 'shopping', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'other', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
            <Tag className="w-5 h-5 mr-2" />
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setFilters.setCategory(
                  filters.category === category.name ? null : category.name
                )}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  filters.category === category.name
                    ? category.color
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
            <Clock className="w-5 h-5 mr-2" />
            Time Frame
          </h3>
          <div className="space-y-2">
            {[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Next 7 Days' },
              { value: 'month', label: 'This Month' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters.setTimeFrame(
                  filters.timeFrame === value ? null : value as 'today' | 'week' | 'month'
                )}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  filters.timeFrame === value
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Status
          </h3>
          <div className="space-y-2">
            {[
              { value: 'completed', label: 'Completed' },
              { value: 'active', label: 'Active' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters.setStatus(
                  filters.status === value ? null : value as 'completed' | 'active'
                )}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  filters.status === value
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}