import { List, Paper, Typography } from '@mui/material';
import type { Task, TaskRowOperation } from '../../domain/task.types';
import { TaskItemRow } from './TaskItemRow';

interface Props {
  tasks: Task[];
  rowPending: Record<number, TaskRowOperation | undefined>;
  onToggle: (taskId: number, done: boolean) => Promise<boolean>;
  onUpdate: (taskId: number, name: string) => Promise<boolean>;
  onDelete: (taskId: number) => Promise<boolean>;
}

export const TaskList = ({ tasks, rowPending, onToggle, onUpdate, onDelete }: Props) => {
  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No tienes tareas registradas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Crea tu primera tarea para comenzar.
        </Typography>
      </Paper>
    );
  }

  return (
    <List disablePadding>
      {tasks.map((task) => (
        <TaskItemRow
          key={task.id}
          task={task}
          rowOperation={rowPending[task.id]}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};
