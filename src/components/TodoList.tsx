import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Filter, Plus, Search, Layout, Sun, Moon } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { CalendarView } from './CalendarView';
import { QuickAdd } from './QuickAdd';
import { FilterPanel } from './FilterPanel';
import { useTodoStore } from '../lib/store/todoStore';
import { useTodoFilters } from '../lib/hooks/useTodoFilters';
import { useTheme } from './theme/ThemeProvider';

export function TodoList() {
  const { todos, isLoading, error, fetchTodos, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodoStore();
  const { filteredTodos, filters, setFilters } = useTodoFilters(todos);
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-dark-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-dark-900">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-700 rounded-custom bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-colors duration-200"
              />
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-custom transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-custom transition-colors duration-200"
            >
              {view === 'list' ? (
                <Calendar className="w-5 h-5" />
              ) : (
                <Layout className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          <div className="col-span-9">
            <div className="bg-white dark:bg-dark-800 rounded-custom shadow-custom p-6 transition-colors duration-200">
              <QuickAdd onAdd={addTodo} />

              {view === 'list' ? (
                <div className="mt-8 space-y-3">
                  {filteredTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onUpdate={updateTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  <CalendarView todos={filteredTodos} onUpdateTodo={updateTodo} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}