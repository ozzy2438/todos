import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertTriangle } from 'lucide-react';
import type { Todo, Priority, Category } from '../types/todo';

interface QuickAddProps {
  onAdd: (todo: Partial<Todo>) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [title, setTitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAdd({
      title: title.trim(),
      priority,
      category,
      dueDate: new Date(dueDate),
      completed: false,
      description: '',
      subtasks: [],
      notes: '',
    });

    setTitle('');
    setShowAdvanced(false);
    setPriority('medium');
    setCategory('personal');
    setDueDate(new Date().toISOString().split('T')[0]);
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 hover:bg-red-200',
    medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    low: 'bg-green-100 text-green-800 hover:bg-green-200',
  };

  const categoryColors = {
    work: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    personal: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    health: 'bg-green-100 text-green-800 hover:bg-green-200',
    shopping: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    other: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-grow relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Tag className="w-5 h-5" />
          </button>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <div className="flex space-x-2">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 rounded-full capitalize ${
                      priority === p ? priorityColors[p] : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p === 'high' && <AlertTriangle className="w-4 h-4 inline-block mr-1" />}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={`w-full px-3 py-1 rounded-lg border-gray-300 ${categoryColors[category]}`}
              >
                {Object.keys(categoryColors).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-1 rounded-lg border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}