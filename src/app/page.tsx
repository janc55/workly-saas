'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Task } from '../types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type TaskFormValues = {
  title: string;
  description?: string | undefined;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (values: TaskFormValues) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        await fetchTasks();
        toast.success('Task created successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create task');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (id: string, status: Task['status']) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchTasks();
        toast.success('Task updated successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast('Are you sure you want to delete this task?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await fetch(`/api/tasks/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              await fetchTasks();
              toast.success('Task deleted successfully!');
            } else {
              const errorData = await res.json();
              throw new Error(errorData.error || 'Failed to delete task');
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            toast.error(errorMessage);
          } finally {
            // Opcional: Cierra el toast de confirmación después de la acción
            toast.dismiss(toastId);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          // Cierra el toast de confirmación sin hacer nada más
          toast.dismiss(toastId);
        },
      },
    });
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
      <TaskForm onSubmit={handleCreateTask} />
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <TaskList tasks={tasks} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
      )}
    </main>
  );
}
