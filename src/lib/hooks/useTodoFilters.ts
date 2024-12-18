import { useState, useMemo } from 'react';
import type { Todo } from '../../types/todo';

export function useTodoFilters(todos: Todo[]) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'today' | 'week' | 'month' | null>(null);
  const [statusFilter, setStatusFilter] = useState<'completed' | 'active' | null>(null);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesCategory = !categoryFilter || todo.category === categoryFilter;
      const matchesStatus = !statusFilter || 
        (statusFilter === 'completed' ? todo.completed : !todo.completed);
      
      let matchesTimeFrame = true;
      if (timeFrame) {
        const today = new Date();
        const dueDate = new Date(todo.dueDate);
        
        switch (timeFrame) {
          case 'today':
            matchesTimeFrame = dueDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            matchesTimeFrame = dueDate <= weekFromNow && dueDate >= today;
            break;
          case 'month':
            const monthFromNow = new Date(today);
            monthFromNow.setMonth(today.getMonth() + 1);
            matchesTimeFrame = dueDate <= monthFromNow && dueDate >= today;
            break;
        }
      }

      return matchesCategory && matchesStatus && matchesTimeFrame;
    });
  }, [todos, categoryFilter, timeFrame, statusFilter]);

  return {
    filteredTodos,
    filters: {
      category: categoryFilter,
      timeFrame,
      status: statusFilter
    },
    setFilters: {
      setCategory: setCategoryFilter,
      setTimeFrame,
      setStatus: setStatusFilter
    }
  };
}