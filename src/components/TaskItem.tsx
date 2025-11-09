import React from 'react';
import { Task } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateStatus, onDelete }) => {
  const statusVariant = {
    pending: 'default',
    in_progress: 'secondary',
    completed: 'outline',
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {task.title}
          <Badge variant={statusVariant[task.status]}>{task.status.replace('_', ' ')}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{task.description}</p>
        <div className="flex items-center space-x-2">
          <Select
            value={task.status}
            onValueChange={(value) => onUpdateStatus(task.id, value as Task['status'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
