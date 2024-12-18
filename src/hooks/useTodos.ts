import { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const todayTodos = todos.filter(todo => {
    const today = new Date();
    const todoDate = new Date(todo.dueDate);
    return (
      todoDate.getDate() === today.getDate() &&
      todoDate.getMonth() === today.getMonth() &&
      todoDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingTodos = todos.filter(todo => {
    const today = new Date();
    const todoDate = new Date(todo.dueDate);
    const diffTime = todoDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  const addTodo = (todoData: Partial<Todo>) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      priority: 'medium',
      category: 'personal',
      dueDate: new Date(),
      completed: false,
      subtasks: [],
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...todoData,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return {
    todos,
    todayTodos,
    upcomingTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
  };
}