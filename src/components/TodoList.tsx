import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Filter, Plus, Search, Layout, Sun, Moon } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { CalendarView } from './calendar/CalendarView';
import { QuickAdd } from './QuickAdd';
import { FilterPanel } from './FilterPanel';
import { useTodoStore } from '../lib/store/todoStore';
import { useTodoFilters } from '../lib/hooks/useTodoFilters';
import { useTheme } from './theme/ThemeProvider';

export function TodoList() {
  const { 
    todos, 
    isLoading, 
    error, 
    fetchTodos, 
    addTodo, 
    toggleTodo, 
    updateTodo, 
    deleteTodo 
  } = useTodoStore();
  const { filteredTodos, filters, setFilters } = useTodoFilters(todos);
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (todo: Partial<Todo>) => {
    try {
      await addTodo({
        ...todo,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      await updateTodo(id, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen transition-colors duration-200
      ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`
            text-3xl font-bold
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            Tasks
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className={`
                  pl-10 pr-4 py-2 rounded-lg
                  border transition-colors duration-200
                  ${isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                `}
              />
              <Search className={`
                w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              `} />
            </div>
            <button
              onClick={toggleTheme}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-500 hover:bg-gray-100'
                }
              `}
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
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="col-span-9">
            <div className={`
              rounded-xl shadow-lg transition-colors duration-200
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            `}>
              <QuickAdd onAdd={handleAddTodo} isDarkMode={isDarkMode} />

              {view === 'list' ? (
                <div className="mt-8 space-y-3 p-6">
                  {filteredTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  <CalendarView 
                    todos={filteredTodos}
                    onUpdateTodo={handleUpdateTodo}
                    onAddTodo={handleAddTodo}
                    onDeleteTodo={handleDeleteTodo}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}