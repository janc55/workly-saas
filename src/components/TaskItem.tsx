import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateStatus, onDelete }) => {
  const statusColors = {
    pending: 'bg-yellow-200',
    in_progress: 'bg-blue-200',
    completed: 'bg-green-200',
  };

  return (
    <div className={`p-4 rounded shadow-md ${statusColors[task.status]}`}>
      <h3 className="text-lg font-bold">{task.title}</h3>
      <p className="text-sm text-gray-700">{task.description}</p>
      <div className="mt-4">
        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(task.id, e.target.value as Task['status'])}
          className="p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={() => onDelete(task.id)}
          className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
