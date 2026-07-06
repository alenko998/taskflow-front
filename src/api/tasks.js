import client from "./client";

export const getTasks       = (projectId) => client.get(`/projects/${projectId}/tasks`);
export const getMyTasks     = () => client.get("/tasks/my");
export const createTask     = (projectId, data) => client.post(`/projects/${projectId}/tasks`, data);
export const updateTask     = (id, data) => client.put(`/tasks/${id}`, data);
export const updateStatus   = (id, status) => client.put(`/tasks/${id}/status`, { status });
export const deleteTask     = (id) => client.delete(`/tasks/${id}`);