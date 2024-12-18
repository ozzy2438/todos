import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from './CalendarDay';
import { DragOverlay } from '../DragOverlay';
import type { Todo } from '../../types/todo';
import { useTheme } from '../theme/ThemeProvider';

interface CalendarViewProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  onAddTodo: (todo: Partial<Todo>) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
}

export function CalendarView({ todos, onUpdateTodo, onAddTodo, onDeleteTodo }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const today = new Date();

  const calendar = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const getTodosForDay = (day: number) => {
    return todos.filter(todo => {
      const todoDate = new Date(todo.dueDate);
      return todoDate.getDate() === day &&
             todoDate.getMonth() === currentDate.getMonth() &&
             todoDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const todoId = event.active.id as string;
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      setActiveTodo(todo);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);
    
    if (!over) return;

    const todoId = active.id as string;
    const newDay = parseInt(over.id as string);
    const todo = todos.find(t => t.id === todoId);
    
    if (!todo) return;

    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), newDay);
    onUpdateTodo(todoId, { dueDate: newDate });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const weekDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const monthYear = currentDate.toLocaleString('tr-TR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`
        select-none rounded-xl shadow-lg overflow-hidden
        ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}
        border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`
              text-2xl font-semibold
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `}>
              {monthYear}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div 
                key={day} 
                className={`
                  text-center text-sm font-medium py-2
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendar.map((day, i) => (
              <CalendarDay
                key={i}
                day={day}
                isToday={
                  day === today.getDate() &&
                  currentDate.getMonth() === today.getMonth() &&
                  currentDate.getFullYear() === today.getFullYear()
                }
                todos={day ? getTodosForDay(day) : []}
                onAddTask={(todo) => onAddTodo({ 
                  ...todo, 
                  dueDate: new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day as number
                  )
                })}
                onEditTask={(todoId) => {
                  const todo = todos.find(t => t.id === todoId);
                  if (todo) {
                    onUpdateTodo(todoId, { ...todo });
                  }
                }}
                onDeleteTask={onDeleteTodo}
                isDarkMode={isDarkMode}
                isDragging={!!activeTodo}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay
        activeTodo={activeTodo}
        isDarkMode={isDarkMode}
      />
    </DndContext>
  );
}