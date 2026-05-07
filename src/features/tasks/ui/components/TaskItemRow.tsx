import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  RadioButtonUnchecked as PendingIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Box, IconButton, ListItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { Task, TaskRowOperation } from '../../domain/task.types';
import { TaskStatusChip } from './TaskStatusChip';

interface Props {
  task: Task;
  rowOperation?: TaskRowOperation;
  onToggle: (taskId: number, done: boolean) => Promise<boolean>;
  onUpdate: (taskId: number, name: string) => Promise<boolean>;
  onDelete: (taskId: number) => Promise<boolean>;
}

export const TaskItemRow = ({
  task,
  rowOperation,
  onToggle,
  onUpdate,
  onDelete,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(task.name);
  const [error, setError] = useState('');

  const isBusy = !!rowOperation;

  const handleSave = async () => {
    const normalizedName = draftName.trim();
    if (!normalizedName) {
      setError('El nombre no puede estar vacío.');
      return;
    }

    if (normalizedName === task.name) {
      setIsEditing(false);
      setError('');
      return;
    }

    const updated = await onUpdate(task.id, normalizedName);
    if (updated) {
      setIsEditing(false);
      setError('');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraftName(task.name);
    setError('');
  };

  return (
    <ListItem
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 1.5,
        px: 2,
        py: 1.5,
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
        <TaskStatusChip done={task.done} />

        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={draftName}
            onChange={(event) => {
              setDraftName(event.target.value);
              if (error) setError('');
            }}
            error={!!error}
            helperText={error}
            disabled={isBusy}
          />
        ) : (
          <Typography
            sx={{
              flex: 1,
              textDecoration: task.done ? 'line-through' : 'none',
              color: task.done ? 'text.secondary' : 'text.primary',
              opacity: task.done ? 0.8 : 1,
            }}
          >
            {task.name}
          </Typography>
        )}

        <Stack direction="row" spacing={1}>
          {isEditing ? (
            <>
              <IconButton
                color="success"
                onClick={handleSave}
                disabled={isBusy}
                aria-label="Guardar tarea"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleCancel}
                disabled={isBusy}
                aria-label="Cancelar edición"
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <IconButton
              color="primary"
              onClick={() => setIsEditing(true)}
              disabled={isBusy}
              aria-label="Editar tarea"
            >
              <EditIcon />
            </IconButton>
          )}

          <IconButton
            color={task.done ? 'warning' : 'success'}
            onClick={() => onToggle(task.id, !task.done)}
            disabled={isBusy}
            aria-label="Cambiar estado de tarea"
          >
            {task.done ? <PendingIcon /> : <CheckCircleIcon />}
          </IconButton>

          <IconButton
            color="error"
            onClick={() => onDelete(task.id)}
            disabled={isBusy}
            aria-label="Eliminar tarea"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>
    </ListItem>
  );
};
