import React, { useState } from 'react';
import { X, Clock, Tag, AlertTriangle } from 'lucide-react';
import type { Todo, Priority, Category } from '../../types/todo';
import { PRIORITY_COLORS, CATEGORY_COLORS } from '../../lib/constants';

interface TaskFormProps {
  initialDate: Date;
  onSubmit: (task: Partial<Todo>) => Promise<void>;
  onClose: () => void;
}

export function TaskForm({ initialDate, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [time, setTime] = useState('12:00');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const [hours, minutes] = time.split(':').map(Number);
    const dueDate = new Date(initialDate);
    dueDate.setHours(hours, minutes);

    await onSubmit({
      title: title.trim(),
      description,
      priority,
      category,
      dueDate,
      completed: false,
      subtasks: [],
      notes: '',
    });
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-dark-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Add Task
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                     bg-white dark:bg-dark-700 text-gray-900 dark:text-white 
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:ring-2 focus:ring-accent-blue focus:border-transparent"
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                     bg-white dark:bg-dark-700 text-gray-900 dark:text-white 
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:ring-2 focus:ring-accent-blue focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                         bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                       bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            >
              {Object.entries(CATEGORY_COLORS).map(([cat]) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <div className="flex space-x-2">
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-full capitalize transition-colors
                  ${priority === p 
                    ? PRIORITY_COLORS[p]
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {p === 'high' && <AlertTriangle className="w-4 h-4 inline-block mr-1" />}
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-accent-blue 
                     hover:bg-accent-blue/90 rounded-lg"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}