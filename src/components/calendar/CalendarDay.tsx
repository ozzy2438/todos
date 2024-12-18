import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CalendarTask } from './CalendarTask';
import { TaskForm } from '../todo/TaskForm';
import { TaskList } from './TaskList';
import type { Todo } from '../../types/todo';

interface CalendarDayProps {
  day: number | null;
  isToday: boolean;
  todos: Todo[];
  month: number;
  year: number;
  onAddTask: (task: Partial<Todo>) => Promise<void>;
  onUpdateTask: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export function CalendarDay({ 
  day, 
  isToday, 
  todos, 
  month, 
  year, 
  onAddTask,
  onUpdateTask,
  onDeleteTask 
}: CalendarDayProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: day?.toString() || 'empty',
  });

  if (!day) {
    return <div className="aspect-square p-1 dark:bg-dark-950" />;
  }

  const handleDayClick = () => {
    if (todos.length > 0) {
      setShowTaskList(true);
    } else {
      setShowTaskForm(true);
    }
  };

  const handleAddTask = async (taskData: Partial<Todo>) => {
    const date = new Date(year, month, day);
    await onAddTask({ ...taskData, dueDate: date });
    setShowTaskForm(false);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleDayClick}
      className={`
        aspect-square p-2 rounded-lg transition-colors relative cursor-pointer
        ${isToday 
          ? 'bg-accent-blue/10 dark:bg-accent-blue/20 border-2 border-accent-blue' 
          : isOver
          ? 'bg-gray-100 dark:bg-dark-800'
          : 'hover:bg-gray-50 dark:hover:bg-dark-800 dark:bg-dark-950'
        }
      `}
    >
      <div className={`
        text-sm font-medium mb-1
        ${isToday 
          ? 'text-accent-blue dark:text-accent-blue' 
          : 'text-gray-900 dark:text-gray-100'
        }
      `}>
        {day}
      </div>
      
      <div className="space-y-1 max-h-[80px] overflow-y-auto">
        {todos.map(todo => (
          <CalendarTask key={todo.id} todo={todo} />
        ))}
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <TaskForm
              initialDate={new Date(year, month, day)}
              onSubmit={handleAddTask}
              onClose={() => setShowTaskForm(false)}
            />
          </div>
        </div>
      )}

      {showTaskList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <TaskList
              date={new Date(year, month, day)}
              tasks={todos}
              onAddNew={() => {
                setShowTaskList(false);
                setShowTaskForm(true);
              }}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onClose={() => setShowTaskList(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}