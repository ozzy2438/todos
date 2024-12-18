import React, { useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CalendarTask } from './CalendarTask';
import type { Todo } from '../types/todo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { Plus, Edit2, Trash2, Calendar, DragHandleDots2Icon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarDayProps {
  day: number | null;
  isToday: boolean;
  todos: Todo[];
  onAddTask: (day: number) => void;
  onEditTask: (todoId: string) => void;
  onDeleteTask: (todoId: string) => void;
  isDarkMode: boolean;
  isDragging?: boolean;
}

export function CalendarDay({ 
  day, 
  isToday, 
  todos, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  isDarkMode,
  isDragging 
}: CalendarDayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setNodeRef, isOver, active } = useDroppable({
    id: day?.toString() || 'empty',
  });

  const handleDayClick = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleAddTask = useCallback(() => {
    if (day) {
      onAddTask(day);
      setIsDialogOpen(false);
    }
  }, [day, onAddTask]);

  if (!day) {
    return <div className="aspect-square p-1" />;
  }

  const dayClassNames = `
    aspect-square p-2 rounded-lg transition-all cursor-pointer
    ${isDarkMode 
      ? isToday
        ? 'bg-blue-900/80 hover:bg-blue-800/90'
        : isOver
          ? 'bg-gray-800/90 ring-2 ring-blue-500/50'
          : 'hover:bg-gray-800/80 bg-gray-900/90'
      : isToday
        ? 'bg-blue-50 hover:bg-blue-100'
        : isOver
          ? 'bg-gray-100/90 ring-2 ring-blue-500/50'
          : 'hover:bg-gray-50/90'
    }
    border border-transparent
    ${isOver ? 'scale-105 shadow-lg border-blue-500/50' : 'hover:border-blue-500/30'}
    transform transition-all duration-200 ease-out
    backdrop-blur-sm
  `;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div
        ref={setNodeRef}
        onClick={handleDayClick}
        className={dayClassNames}
      >
        <div className={`
          text-sm mb-2 font-medium flex justify-between items-center
          ${isDarkMode
            ? isToday ? 'text-blue-200' : 'text-gray-200'
            : isToday ? 'text-blue-600' : 'text-gray-700'
          }
        `}>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="opacity-70" />
            <span className="font-semibold">{day}</span>
          </div>
          {todos.length > 0 && (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`
                text-xs px-2 py-0.5 rounded-full font-semibold
                ${isDarkMode 
                  ? 'bg-blue-900/60 text-blue-200 border border-blue-700/50' 
                  : 'bg-blue-100/80 text-blue-600 border border-blue-200/50'
                }
                shadow-sm
              `}
            >
              {todos.length}
            </motion.span>
          )}
        </div>
        <AnimatePresence>
          <div className="space-y-1.5 max-h-[80px] overflow-y-auto custom-scrollbar">
            {todos.map(todo => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarTask 
                  todo={todo} 
                  isDarkMode={isDarkMode}
                  isDragging={isDragging}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`
          ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}
          max-w-md rounded-xl shadow-xl
          transform transition-all duration-200
          border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <DialogHeader>
            <DialogTitle className={`
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
              flex items-center gap-2 text-xl
            `}>
              <Calendar className="opacity-70" />
              <span>{day} Günü İçin İşlemler</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-4">
            <Button
              onClick={handleAddTask}
              className="w-full flex items-center justify-center gap-2 font-medium text-base py-6"
              variant={isDarkMode ? "outline" : "default"}
              size="lg"
            >
              <Plus size={20} />
              Yeni Görev Ekle
            </Button>

            {todos.length > 0 && (
              <div className="space-y-3">
                <h3 className={`
                  text-sm font-medium flex items-center gap-2
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  <DragHandleDots2Icon size={16} className="opacity-70" />
                  Mevcut Görevler ({todos.length})
                </h3>
                <motion.div layout className="space-y-2">
                  {todos.map(todo => (
                    <motion.div
                      key={todo.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`
                        flex items-center justify-between p-3 rounded-lg
                        ${isDarkMode 
                          ? 'bg-gray-800/80 hover:bg-gray-750' 
                          : 'bg-gray-50 hover:bg-gray-100'
                        }
                        transition-all duration-200 group
                        border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                      `}
                    >
                      <div className="flex flex-col">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {todo.title}
                        </span>
                        {todo.category && (
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {todo.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditTask(todo.id)}
                          className={`
                            hover:bg-opacity-10 
                            ${isDarkMode 
                              ? 'hover:bg-white text-blue-400 hover:text-blue-300' 
                              : 'hover:bg-gray-200 text-blue-600 hover:text-blue-700'
                            }
                          `}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteTask(todo.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}