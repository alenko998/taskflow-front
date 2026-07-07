import client from "./client";

export const getProjects   = ()        => client.get("/project");
export const getProject    = (id)      => client.get(`/project/${id}`);
export const createProject = (data)    => client.post("/project", data);
export const updateProject = (id,data) => client.put(`/project/${id}`, data);
export const deleteProject = (id)      => client.delete(`/project/${id}`);