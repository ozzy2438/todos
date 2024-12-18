import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CalendarTask } from './CalendarTask';
import type { Todo } from '../types/todo';

interface CalendarDayProps {
  day: number | null;
  isToday: boolean;
  todos: Todo[];
}

export function CalendarDay({ day, isToday, todos }: CalendarDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day?.toString() || 'empty',
  });

  if (!day) {
    return <div className="aspect-square p-1" />;
  }

  return (
    <div
      ref={setNodeRef}
      className={`aspect-square p-1 rounded-lg transition-colors ${
        isToday
          ? 'bg-blue-50'
          : isOver
          ? 'bg-gray-100'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className={`text-sm mb-1 ${
        isToday ? 'font-bold text-blue-600' : 'text-gray-700'
      }`}>
        {day}
      </div>
      <div className="space-y-1 max-h-[80px] overflow-y-auto">
        {todos.map(todo => (
          <CalendarTask key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}