import client from "./client";

export const getComments    = (taskId) => client.get(`/tasks/${taskId}/comments`);
export const createComment  = (taskId, content) => client.post(`/tasks/${taskId}/comments`, { content });
export const updateComment  = (id, content) => client.put(`/comments/${id}`, { content });
export const deleteComment  = (id) => client.delete(`/comments/${id}`);