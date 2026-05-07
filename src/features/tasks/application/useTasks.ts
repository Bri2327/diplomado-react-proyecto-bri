import { isAxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useAlert, useAxios } from '../../../hooks';
import type { Task, TaskRowOperation } from '../domain/task.types';
import { createTaskService } from '../infrastructure/task.service';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  isCreating: boolean;
  rowPending: Record<number, TaskRowOperation | undefined>;
  error: string | null;
}

type TasksAction =
  | { type: 'load_start' }
  | { type: 'load_success'; payload: Task[] }
  | { type: 'load_error'; payload: string }
  | { type: 'create_start' }
  | { type: 'create_success'; payload: Task }
  | { type: 'create_error' }
  | { type: 'row_start'; payload: { taskId: number; operation: TaskRowOperation } }
  | { type: 'row_finish'; payload: { taskId: number } }
  | { type: 'task_updated'; payload: { taskId: number; updates: Partial<Task> } }
  | { type: 'task_deleted'; payload: { taskId: number } };

const initialState: TasksState = {
  tasks: [],
  isLoading: true,
  isCreating: false,
  rowPending: {},
  error: null,
};

const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case 'load_start':
      return { ...state, isLoading: true, error: null };
    case 'load_success':
      return { ...state, isLoading: false, error: null, tasks: action.payload };
    case 'load_error':
      return { ...state, isLoading: false, error: action.payload };
    case 'create_start':
      return { ...state, isCreating: true };
    case 'create_success':
      return {
        ...state,
        isCreating: false,
        error: null,
        tasks: [action.payload, ...state.tasks],
      };
    case 'create_error':
      return { ...state, isCreating: false };
    case 'row_start':
      return {
        ...state,
        rowPending: {
          ...state.rowPending,
          [action.payload.taskId]: action.payload.operation,
        },
      };
    case 'row_finish': {
      const rowPending = { ...state.rowPending };
      delete rowPending[action.payload.taskId];
      return { ...state, rowPending };
    }
    case 'task_updated':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task,
        ),
      };
    case 'task_deleted':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.taskId),
      };
    default:
      return state;
  }
};

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === 'string') return apiMessage;
  }

  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado.';
};

export const useTasks = () => {
  const axios = useAxios();
  const { showAlert } = useAlert();
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const taskService = useMemo(() => createTaskService(axios), [axios]);

  const loadTasks = useCallback(async () => {
    dispatch({ type: 'load_start' });
    try {
      const response = await taskService.getTasks();
      dispatch({ type: 'load_success', payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: 'load_error', payload: message });
      showAlert(message, 'error');
    }
  }, [showAlert, taskService]);

  const createTask = useCallback(
    async (name: string) => {
      dispatch({ type: 'create_start' });
      try {
        const createdTask = await taskService.createTask({ name });
        dispatch({ type: 'create_success', payload: createdTask });
        showAlert('Tarea creada correctamente.', 'success');
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        dispatch({ type: 'create_error' });
        showAlert(message, 'error');
        return false;
      }
    },
    [showAlert, taskService],
  );

  const updateTask = useCallback(
    async (taskId: number, name: string) => {
      dispatch({
        type: 'row_start',
        payload: { taskId, operation: 'updating' },
      });
      try {
        await taskService.updateTask(taskId, { name });
        dispatch({
          type: 'task_updated',
          payload: { taskId, updates: { name } },
        });
        showAlert('Tarea actualizada correctamente.', 'success');
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        showAlert(message, 'error');
        return false;
      } finally {
        dispatch({ type: 'row_finish', payload: { taskId } });
      }
    },
    [showAlert, taskService],
  );

  const toggleTask = useCallback(
    async (taskId: number, done: boolean) => {
      dispatch({
        type: 'row_start',
        payload: { taskId, operation: 'toggling' },
      });
      try {
        await taskService.toggleTask(taskId, { done });
        dispatch({
          type: 'task_updated',
          payload: { taskId, updates: { done } },
        });
        showAlert(
          done ? 'Tarea marcada como finalizada.' : 'Tarea marcada como pendiente.',
          'success',
        );
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        showAlert(message, 'error');
        return false;
      } finally {
        dispatch({ type: 'row_finish', payload: { taskId } });
      }
    },
    [showAlert, taskService],
  );

  const deleteTask = useCallback(
    async (taskId: number) => {
      dispatch({
        type: 'row_start',
        payload: { taskId, operation: 'deleting' },
      });
      try {
        await taskService.deleteTask(taskId);
        dispatch({ type: 'task_deleted', payload: { taskId } });
        showAlert('Tarea eliminada correctamente.', 'success');
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        showAlert(message, 'error');
        return false;
      } finally {
        dispatch({ type: 'row_finish', payload: { taskId } });
      }
    },
    [showAlert, taskService],
  );

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  return {
    tasks: state.tasks,
    isLoading: state.isLoading,
    isCreating: state.isCreating,
    rowPending: state.rowPending,
    error: state.error,
    loadTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
};
