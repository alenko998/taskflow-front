import client from "./client";

export const getWorkspace      = () => client.get("/workspace");
export const updateWorkspace   = (data) => client.put("/workspace", data);
export const inviteMember      = (data) => client.post("/workspace/invite", data);
export const getMembers        = () => client.get("/workspace/members");
export const updateMemberRole  = (userId, role) => client.put(`/workspace/members/${userId}/role`, { role });
export const removeMember      = (userId) => client.delete(`/workspace/members/${userId}`);
export const acceptInvitation = (token) => client.post("/workspace/accept-invitation", { token });
export const getMyWorkspaces  = ()               => client.get("/workspace/my");
export const switchWorkspace  = (workspaceId)    => client.post("/workspace/switch", { workspaceId });
export const createWorkspace = (name) => client.post("/workspace", { name });