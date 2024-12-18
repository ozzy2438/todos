import type { Database } from '../supabase/types';
import type { Todo, SubTask } from '../../types/todo';

type DBTodo = Database['public']['Tables']['todos']['Row'];
type DBSubTask = Database['public']['Tables']['subtasks']['Row'];

export function mapTodoFromDB(dbTodo: DBTodo & { subtasks?: DBSubTask[] }): Todo {
  return {
    id: dbTodo.id,
    title: dbTodo.title,
    description: dbTodo.description,
    priority: dbTodo.priority,
    category: dbTodo.category as Todo['category'],
    dueDate: new Date(dbTodo.due_date),
    completed: dbTodo.completed,
    recurring: dbTodo.recurring_frequency ? {
      frequency: dbTodo.recurring_frequency,
      endDate: dbTodo.recurring_end_date ? new Date(dbTodo.recurring_end_date) : undefined
    } : undefined,
    subtasks: (dbTodo.subtasks || []).map(mapSubTaskFromDB),
    notes: dbTodo.notes,
    createdAt: new Date(dbTodo.created_at),
    updatedAt: new Date(dbTodo.updated_at)
  };
}

export function mapTodoToDB(todo: Partial<Todo>) {
  return {
    ...(todo.title && { title: todo.title }),
    ...(todo.description && { description: todo.description }),
    ...(todo.priority && { priority: todo.priority }),
    ...(todo.category && { category: todo.category }),
    ...(todo.dueDate && { due_date: todo.dueDate.toISOString() }),
    ...(typeof todo.completed === 'boolean' && { completed: todo.completed }),
    ...(todo.recurring && {
      recurring_frequency: todo.recurring.frequency,
      recurring_end_date: todo.recurring.endDate?.toISOString()
    }),
    ...(todo.notes && { notes: todo.notes }),
    updated_at: new Date().toISOString()
  };
}

function mapSubTaskFromDB(dbSubTask: DBSubTask): SubTask {
  return {
    id: dbSubTask.id,
    title: dbSubTask.title,
    completed: dbSubTask.completed
  };
}