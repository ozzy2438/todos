import React, { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from './CalendarDay';
import type { Todo } from '../../types/todo';

interface CalendarViewProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  onAddTodo: (todo: Partial<Todo>) => Promise<void>;
}

export function CalendarView({ todos, onUpdateTodo, onAddTodo }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthYear = currentDate.toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="select-none bg-white dark:bg-dark-900 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {monthYear}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 
                       text-gray-600 dark:text-gray-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 
                       text-gray-600 dark:text-gray-400"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, i) => (
            <CalendarDay
              key={i}
              day={day}
              month={currentDate.getMonth()}
              year={currentDate.getFullYear()}
              isToday={
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear()
              }
              todos={day ? getTodosForDay(day) : []}
              onAddTask={onAddTodo}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}