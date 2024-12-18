import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Todo } from '../types/todo';

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
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        text-xs p-1 rounded border cursor-move
        ${priorityColors[todo.priority]}
        ${isDragging ? 'opacity-50' : ''}
        truncate
      `}
    >
      {todo.title}
    </div>
  );
}