import React from 'react';
import { Tag, Clock, CheckCircle2, Filter } from 'lucide-react';
import type { Category } from '../types/todo';
import { motion, AnimatePresence } from 'framer-motion';

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
  isDarkMode: boolean;
}

export function FilterPanel({ filters, setFilters, isDarkMode }: FilterPanelProps) {
  const categories: { name: Category; color: string; activeColor: string; icon: JSX.Element }[] = [
    { 
      name: 'work', 
      color: isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-50 text-blue-700',
      activeColor: isDarkMode ? 'bg-blue-800 text-blue-100 border-blue-600' : 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Tag className="w-4 h-4" />
    },
    { 
      name: 'personal', 
      color: isDarkMode ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-50 text-purple-700',
      activeColor: isDarkMode ? 'bg-purple-800 text-purple-100 border-purple-600' : 'bg-purple-100 text-purple-800 border-purple-300',
      icon: <Tag className="w-4 h-4" />
    },
    { 
      name: 'health', 
      color: isDarkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-50 text-green-700',
      activeColor: isDarkMode ? 'bg-green-800 text-green-100 border-green-600' : 'bg-green-100 text-green-800 border-green-300',
      icon: <Tag className="w-4 h-4" />
    },
    { 
      name: 'shopping', 
      color: isDarkMode ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-50 text-yellow-700',
      activeColor: isDarkMode ? 'bg-yellow-800 text-yellow-100 border-yellow-600' : 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: <Tag className="w-4 h-4" />
    },
    { 
      name: 'other', 
      color: isDarkMode ? 'bg-gray-800/50 text-gray-200' : 'bg-gray-50 text-gray-700',
      activeColor: isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300',
      icon: <Tag className="w-4 h-4" />
    },
  ];

  const timeFrames = [
    { 
      value: 'today', 
      label: 'Bugün', 
      icon: <Clock className="w-4 h-4" />,
      color: isDarkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-700',
      activeColor: isDarkMode ? 'bg-indigo-800 text-indigo-100 border-indigo-600' : 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    { 
      value: 'week', 
      label: 'Gelecek 7 Gün', 
      icon: <Clock className="w-4 h-4" />,
      color: isDarkMode ? 'bg-pink-900/50 text-pink-200' : 'bg-pink-50 text-pink-700',
      activeColor: isDarkMode ? 'bg-pink-800 text-pink-100 border-pink-600' : 'bg-pink-100 text-pink-800 border-pink-300',
    },
    { 
      value: 'month', 
      label: 'Bu Ay', 
      icon: <Clock className="w-4 h-4" />,
      color: isDarkMode ? 'bg-cyan-900/50 text-cyan-200' : 'bg-cyan-50 text-cyan-700',
      activeColor: isDarkMode ? 'bg-cyan-800 text-cyan-100 border-cyan-600' : 'bg-cyan-100 text-cyan-800 border-cyan-300',
    },
  ];

  const statuses = [
    { 
      value: 'completed', 
      label: 'Tamamlananlar', 
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: isDarkMode ? 'bg-teal-900/50 text-teal-200' : 'bg-teal-50 text-teal-700',
      activeColor: isDarkMode ? 'bg-teal-800 text-teal-100 border-teal-600' : 'bg-teal-100 text-teal-800 border-teal-300',
    },
    { 
      value: 'active', 
      label: 'Aktif', 
      icon: <Filter className="w-4 h-4" />,
      color: isDarkMode ? 'bg-orange-900/50 text-orange-200' : 'bg-orange-50 text-orange-700',
      activeColor: isDarkMode ? 'bg-orange-800 text-orange-100 border-orange-600' : 'bg-orange-100 text-orange-800 border-orange-300',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl shadow-lg overflow-hidden border
        ${isDarkMode 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
        }
      `}
    >
      <div className="p-6 space-y-8">
        <div>
          <h3 className={`
            text-lg font-semibold flex items-center gap-2 mb-4
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            <Tag className="w-5 h-5" />
            Kategoriler
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {categories.map(category => (
                <motion.button
                  key={category.name}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setFilters.setCategory(
                    filters.category === category.name ? null : category.name
                  )}
                  className={`
                    w-full flex items-center gap-2 px-4 py-2.5 rounded-lg
                    transition-all duration-200 border
                    ${filters.category === category.name 
                      ? category.activeColor
                      : `${category.color} hover:scale-[1.02] hover:shadow-md border-transparent`
                    }
                  `}
                >
                  {category.icon}
                  <span className="capitalize">{category.name}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h3 className={`
            text-lg font-semibold flex items-center gap-2 mb-4
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            <Clock className="w-5 h-5" />
            Zaman Aralığı
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {timeFrames.map(({ value, label, icon, color, activeColor }) => (
                <motion.button
                  key={value}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setFilters.setTimeFrame(
                    filters.timeFrame === value ? null : value as 'today' | 'week' | 'month'
                  )}
                  className={`
                    w-full flex items-center gap-2 px-4 py-2.5 rounded-lg
                    transition-all duration-200 border
                    ${filters.timeFrame === value 
                      ? activeColor
                      : `${color} hover:scale-[1.02] hover:shadow-md border-transparent`
                    }
                  `}
                >
                  {icon}
                  <span>{label}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h3 className={`
            text-lg font-semibold flex items-center gap-2 mb-4
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            <CheckCircle2 className="w-5 h-5" />
            Durum
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {statuses.map(({ value, label, icon, color, activeColor }) => (
                <motion.button
                  key={value}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setFilters.setStatus(
                    filters.status === value ? null : value as 'completed' | 'active'
                  )}
                  className={`
                    w-full flex items-center gap-2 px-4 py-2.5 rounded-lg
                    transition-all duration-200 border
                    ${filters.status === value 
                      ? activeColor
                      : `${color} hover:scale-[1.02] hover:shadow-md border-transparent`
                    }
                  `}
                >
                  {icon}
                  <span>{label}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}