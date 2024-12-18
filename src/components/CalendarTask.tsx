import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Todo } from '../types/todo';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Clock, Tag, AlertCircle } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';

interface CalendarTaskProps {
  todo: Todo;
  isDarkMode: boolean;
  isDragging?: boolean;
}

export function CalendarTask({ todo, isDarkMode, isDragging }: CalendarTaskProps) {
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable({
    id: todo.id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const getPriorityColor = (priority: string): string => {
    const baseColors: Record<Priority, string> = {
      high: isDarkMode 
        ? 'bg-red-900/80 text-red-200 border-red-800' 
        : 'bg-red-100 text-red-800 border-red-200',
      medium: isDarkMode 
        ? 'bg-yellow-900/80 text-yellow-200 border-yellow-800' 
        : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: isDarkMode 
        ? 'bg-green-900/80 text-green-200 border-green-800' 
        : 'bg-green-100 text-green-800 border-green-200',
    };

    const normalizedPriority = priority.toLowerCase() as Priority;
    return baseColors[normalizedPriority] || (isDarkMode 
      ? 'bg-gray-800/80 text-gray-200 border-gray-700' 
      : 'bg-gray-100 text-gray-800 border-gray-200');
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isDragging ? 1.05 : 1,
          boxShadow: isDragging 
            ? '0 10px 30px rgba(0,0,0,0.3)' 
            : '0 1px 3px rgba(0,0,0,0.1)',
          zIndex: isDragging ? 50 : 1,
        }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.2,
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          group relative
          p-3 rounded-lg cursor-grab active:cursor-grabbing
          transform transition-all duration-200
          hover:scale-[1.02] hover:shadow-lg
          ${isDarkMode 
            ? 'bg-gray-800/90 hover:bg-gray-750 border border-gray-700' 
            : 'bg-white hover:bg-gray-50/90 border border-gray-200'
          }
          ${isDragging ? 'shadow-2xl scale-105' : ''}
        `}
      >
        {/* Sürükleme tutamacı */}
        <div className={`
          absolute -left-2 top-1/2 -translate-y-1/2
          opacity-0 group-hover:opacity-100
          transition-all duration-200
          ${isDragging ? 'opacity-100' : ''}
        `}>
          <div className={`
            p-1 rounded-md
            ${isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}>
            <GripVertical size={14} />
          </div>
        </div>

        {/* Görev içeriği */}
        <div className="flex flex-col gap-2 pl-2">
          <div className="flex items-center justify-between gap-2">
            <span className={`
              text-sm truncate flex-1 font-medium
              ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
            `}>
              {todo.title}
            </span>
            {todo.priority && (
              <span className={`
                text-xs px-2 py-0.5 rounded-full border
                ${getPriorityColor(todo.priority)}
                shadow-sm flex items-center gap-1
              `}>
                <AlertCircle size={10} />
                {todo.priority}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {todo.category && (
              <div className={`
                flex items-center gap-1 text-xs
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              `}>
                <Tag size={10} className="opacity-70" />
                <span>{todo.category}</span>
              </div>
            )}
            {todo.dueTime && (
              <div className={`
                flex items-center gap-1 text-xs
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              `}>
                <Clock size={10} className="opacity-70" />
                <span>{todo.dueTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sürükleme göstergesi */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              absolute inset-0 rounded-lg border-2 
              ${isDarkMode ? 'border-blue-500/50' : 'border-blue-400/50'}
            `}
            transition={{ duration: 0.2 }}
          >
            <div className={`
              absolute inset-0 rounded-lg
              bg-gradient-to-r
              ${isDarkMode 
                ? 'from-blue-500/10 to-purple-500/10' 
                : 'from-blue-400/10 to-purple-400/10'
              }
              animate-pulse
            `} />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}