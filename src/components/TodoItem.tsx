import React, { useState } from 'react';
import { Check, Clock, Edit2, Trash2 } from 'lucide-react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`flex items-center p-3 rounded-lg border ${
      todo.completed ? 'bg-gray-50' : 'bg-white'
    }`}>
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 ${
          todo.completed
            ? 'bg-blue-500 border-blue-500'
            : 'border-gray-300'
        }`}
      >
        {todo.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <h3 className={`font-medium ${
            todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            priorityColors[todo.priority]
          }`}>
            {todo.priority}
          </span>
        </div>

        {todo.description && (
          <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
        )}

        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
          <span className="px-2 py-1 rounded-full bg-gray-100">
            {todo.category}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Edit2 className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Trash2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}