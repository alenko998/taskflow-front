import client from "./client";

export const getTasks     = (projectId) => client.get(`/task/project/${projectId}`);
export const getMyTasks   = ()          => client.get("/task/my");
export const createTask   = (projectId, data) => client.post("/task", data);
export const updateTask   = (id, data)  => client.put(`/task/${id}`, data);
export const updateStatus = (id, status) => client.put(`/task/${id}/status`, { status });
export const deleteTask   = (id)        => client.delete(`/task/${id}`);