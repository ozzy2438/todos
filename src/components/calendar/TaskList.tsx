import React from 'react';
import { X, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import type { Todo } from '../../types/todo';

interface TaskListProps {
  date: Date;
  tasks: Todo[];
  onAddNew: () => void;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export function TaskList({ date, tasks, onAddNew, onUpdate, onDelete, onClose }: TaskListProps) {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const priorityColors = {
    high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    low: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Tasks for {formattedDate}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`
              p-3 rounded-lg border
              ${priorityColors[task.priority]}
              transition-all duration-200
              hover:shadow-md
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(task.dueDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onUpdate(task.id, { completed: !task.completed })}
                  className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddNew}
        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/90 rounded-lg"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Task
      </button>
    </div>
  );
}