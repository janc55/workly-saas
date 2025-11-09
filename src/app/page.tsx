'use client';

import { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Task } from '../types';

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
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (title: string, description: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        await fetchTasks();
        alert('Task created successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create task');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
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
        alert('Task updated successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await fetchTasks();
          alert('Task deleted successfully!');
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to delete task');
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm onSubmit={handleCreateTask} />
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <TaskList tasks={tasks} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
      )}
    </main>
  );
}
