import client from "./client";

export const getWorkspace      = () => client.get("/workspace");
export const updateWorkspace   = (data) => client.put("/workspace", data);
export const inviteMember      = (data) => client.post("/workspace/invite", data);
export const getMembers        = () => client.get("/workspace/members");
export const updateMemberRole  = (userId, role) => client.put(`/workspace/members/${userId}/role`, { role });
export const removeMember      = (userId) => client.delete(`/workspace/members/${userId}`);