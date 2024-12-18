import React, { useEffect } from 'react';
import { TodoList } from './components/TodoList';
import { LoginPage } from './components/auth/LoginPage';
import { useAuthStore } from './lib/store/authStore';
import { supabase } from './lib/supabase/config';
import { ThemeProvider } from './components/theme/ThemeProvider';

export default function App() {
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        useAuthStore.setState({ user: session.user });
      } else {
        useAuthStore.setState({ user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      {user ? <TodoList /> : <LoginPage />}
    </ThemeProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen dark:bg-dark-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue" />
    </div>
  );
}