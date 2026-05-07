export interface Task {
  id: number;
  name: string;
  done: boolean;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskListResponse {
  total: number;
  page: number;
  pages: number;
  data: Task[];
}

export interface TaskCreateInput {
  name: string;
}

export interface TaskUpdateInput {
  name: string;
}

export interface TaskToggleInput {
  done: boolean;
}

export type TaskRowOperation = 'updating' | 'toggling' | 'deleting';
