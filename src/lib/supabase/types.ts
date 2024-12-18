export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          title: string
          description: string
          priority: 'high' | 'medium' | 'low'
          category: string
          due_date: string
          completed: boolean
          recurring_frequency: 'daily' | 'weekly' | 'monthly' | null
          recurring_end_date: string | null
          notes: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          priority?: 'high' | 'medium' | 'low'
          category?: string
          due_date?: string
          completed?: boolean
          recurring_frequency?: 'daily' | 'weekly' | 'monthly' | null
          recurring_end_date?: string | null
          notes?: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          priority?: 'high' | 'medium' | 'low'
          category?: string
          due_date?: string
          completed?: boolean
          recurring_frequency?: 'daily' | 'weekly' | 'monthly' | null
          recurring_end_date?: string | null
          notes?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          todo_id: string
          title: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          todo_id: string
          title: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          todo_id?: string
          title?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}