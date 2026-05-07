import type { AxiosInstance } from 'axios';
import type {
  Task,
  TaskCreateInput,
  TaskListResponse,
  TaskToggleInput,
  TaskUpdateInput,
} from '../domain/task.types';

interface TaskApiItem {
  id: number;
  name: string;
  done: boolean;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskListApiResponse {
  total?: number;
  page?: number;
  pages?: number;
  data?: TaskApiItem[];
}

const mapTask = (task: TaskApiItem): Task => ({
  id: task.id,
  name: task.name,
  done: task.done,
  userId: task.userId,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const getAffectedRows = (payload: unknown): number => {
  if (Array.isArray(payload) && typeof payload[0] === 'number') {
    return payload[0];
  }
  if (typeof payload === 'number') {
    return payload;
  }
  return 1;
};

const assertRowsAffected = (payload: unknown, actionName: string) => {
  const affectedRows = getAffectedRows(payload);
  if (affectedRows <= 0) {
    throw new Error(`No fue posible ${actionName} la tarea.`);
  }
};

export const createTaskService = (client: AxiosInstance) => {
  return {
    async getTasks(): Promise<TaskListResponse> {
      const response = await client.get<TaskListApiResponse>('/tasks');
      const tasks = Array.isArray(response.data.data)
        ? response.data.data.map(mapTask)
        : [];

      return {
        total: response.data.total ?? tasks.length,
        page: response.data.page ?? 1,
        pages: response.data.pages ?? 1,
        data: tasks,
      };
    },

    async createTask(input: TaskCreateInput): Promise<Task> {
      const response = await client.post<TaskApiItem>('/tasks', input);
      return mapTask(response.data);
    },

    async updateTask(id: number, input: TaskUpdateInput): Promise<void> {
      const response = await client.put<unknown>(`/tasks/${id}`, input);
      assertRowsAffected(response.data, 'actualizar');
    },

    async toggleTask(id: number, input: TaskToggleInput): Promise<void> {
      const response = await client.patch<unknown>(`/tasks/${id}`, input);
      assertRowsAffected(response.data, 'cambiar el estado de');
    },

    async deleteTask(id: number): Promise<void> {
      await client.delete(`/tasks/${id}`);
    },
  };
};
