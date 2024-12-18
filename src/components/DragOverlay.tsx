import React from 'react';
import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { CalendarTask } from './CalendarTask';
import type { Todo } from '../types/todo';

interface DragOverlayProps {
  activeTodo: Todo | null;
  isDarkMode: boolean;
}

export function DragOverlay({ activeTodo, isDarkMode }: DragOverlayProps) {
  if (!activeTodo) return null;

  return (
    <DndDragOverlay>
      <div style={{ 
        transform: 'rotate(-2deg) scale(1.05)',
        pointerEvents: 'none',
      }}>
        <CalendarTask
          todo={activeTodo}
          isDarkMode={isDarkMode}
          isDragging={true}
        />
      </div>
    </DndDragOverlay>
  );
} 