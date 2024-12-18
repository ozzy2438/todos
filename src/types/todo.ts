export type Priority = 'high' | 'medium' | 'low';
export type Category = 'work' | 'personal' | 'health' | 'shopping' | 'other';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: Date;
  completed: boolean;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  subtasks: SubTask[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}