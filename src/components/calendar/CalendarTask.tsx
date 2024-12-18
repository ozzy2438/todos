import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Clock } from 'lucide-react';
import type { Todo } from '../../types/todo';

interface CalendarTaskProps {
  todo: Todo;
}

export function CalendarTask({ todo }: CalendarTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const priorityColors = {
    high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    low: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  };

  const formattedTime = new Date(todo.dueDate).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group text-xs p-2 rounded-md border cursor-move
        transition-all duration-200
        hover:shadow-md
        ${priorityColors[todo.priority]}
        ${isDragging ? 'opacity-50 scale-105' : ''}
        ${todo.completed ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="truncate font-medium">{todo.title}</span>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}