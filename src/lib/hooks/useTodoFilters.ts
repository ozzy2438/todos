import { useState, useMemo, useCallback } from 'react';
import type { Todo } from '../types/todo';

export function useTodoFilters(todos: Todo[]) {
  const [category, setCategory] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'today' | 'week' | 'month' | null>(null);
  const [status, setStatus] = useState<'completed' | 'active' | null>(null);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Kategori filtresi
      if (category && todo.category !== category) {
        return false;
      }

      // Durum filtresi
      if (status === 'completed' && !todo.completed) {
        return false;
      }
      if (status === 'active' && todo.completed) {
        return false;
      }

      // Zaman filtresi
      if (timeFrame) {
        const today = new Date();
        const todoDate = new Date(todo.dueDate);
        
        // Bugünün başlangıcı
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // Bugünün sonu
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        
        // Haftanın sonu
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        endOfWeek.setHours(23, 59, 59);
        
        // Ayın sonu
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        switch (timeFrame) {
          case 'today':
            if (todoDate < startOfToday || todoDate > endOfToday) {
              return false;
            }
            break;
          case 'week':
            if (todoDate < startOfToday || todoDate > endOfWeek) {
              return false;
            }
            break;
          case 'month':
            if (todoDate < startOfToday || todoDate > endOfMonth) {
              return false;
            }
            break;
        }
      }

      return true;
    });
  }, [todos, category, timeFrame, status]);

  const handleSetCategory = useCallback((newCategory: string | null) => {
    setCategory(prev => prev === newCategory ? null : newCategory);
  }, []);

  const handleSetTimeFrame = useCallback((newTimeFrame: 'today' | 'week' | 'month' | null) => {
    setTimeFrame(prev => prev === newTimeFrame ? null : newTimeFrame);
  }, []);

  const handleSetStatus = useCallback((newStatus: 'completed' | 'active' | null) => {
    setStatus(prev => prev === newStatus ? null : newStatus);
  }, []);

  return {
    filteredTodos,
    filters: {
      category,
      timeFrame,
      status,
    },
    setFilters: {
      setCategory: handleSetCategory,
      setTimeFrame: handleSetTimeFrame,
      setStatus: handleSetStatus,
    },
  };
}