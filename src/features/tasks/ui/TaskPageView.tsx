import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useTasks } from '../application/useTasks';
import { TaskCreateForm } from './components/TaskCreateForm';
import { TaskList } from './components/TaskList';

export const TaskPageView = () => {
  const {
    tasks,
    isLoading,
    isCreating,
    rowPending,
    error,
    loadTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Mis Tareas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona tus tareas y alterna su estado entre pendiente y finalizada.
        </Typography>
      </Box>

      <TaskCreateForm isCreating={isCreating} onCreate={createTask} />

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void loadTasks()}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TaskList
          tasks={tasks}
          rowPending={rowPending}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </Stack>
  );
};
