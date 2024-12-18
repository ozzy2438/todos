import { create } from 'zustand';
import { supabase } from '../supabase/config';
import type { Todo } from '../../types/todo';
import { mapTodoFromDB, mapTodoToDB } from '../utils/todoMapper';

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Partial<Todo>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*, subtasks(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const mappedTodos = data?.map(mapTodoFromDB) || [];
      set({ todos: mappedTodos, isLoading: false });
    } catch (error) {
      console.error('Error fetching todos:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTodo: async (todoData: Partial<Todo>) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = {
        ...todoData,
        user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
      };

      const { data, error } = await supabase
        .from('todos')
        .insert(mapTodoToDB(newTodo))
        .select('*, subtasks(*)')
        .single();

      if (error) throw error;
      
      const mappedTodo = mapTodoFromDB(data);
      set(state => ({
        todos: [mappedTodo, ...state.todos],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error adding todo:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTodo: async (id: string, updates: Partial<Todo>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('todos')
        .update(mapTodoToDB(updates))
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating todo:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteTodo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting todo:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  toggleTodo: async (id: string) => {
    const todo = get().todos.find(t => t.id === id);
    if (!todo) return;

    await get().updateTodo(id, { completed: !todo.completed });
  },
}));