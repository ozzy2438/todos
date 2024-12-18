import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { CalendarDay } from './CalendarDay';
import { CalendarTask } from './CalendarTask';
import type { Todo } from '../types/todo';

interface CalendarViewProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
}

export function CalendarView({ todos, onUpdateTodo }: CalendarViewProps) {
  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
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

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(today);

  const calendar = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const getTodosForDay = (day: number) => {
    return todos.filter(todo => {
      const todoDate = new Date(todo.dueDate);
      return todoDate.getDate() === day &&
             todoDate.getMonth() === today.getMonth() &&
             todoDate.getFullYear() === today.getFullYear();
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const todoId = active.id as string;
    const newDay = parseInt(over.id as string);
    const todo = todos.find(t => t.id === todoId);
    
    if (!todo) return;

    const newDate = new Date(today.getFullYear(), today.getMonth(), newDay);
    onUpdateTodo(todoId, { dueDate: newDate });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="select-none">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, i) => (
            <CalendarDay
              key={i}
              day={day}
              isToday={day === today.getDate()}
              todos={day ? getTodosForDay(day) : []}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}