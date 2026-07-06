import client from "./client";

export const login          = (data) => client.post("/auth/login", data);
export const register       = (data) => client.post("/auth/register", data);
export const verifyEmail    = (userId, token) => client.get(`/auth/verify-email?userId=${userId}&token=${token}`);
export const forgotPassword = (email) => client.post("/auth/forgot-password", { email });
export const resetPassword  = (data) => client.post("/auth/reset-password", data);
export const getMe          = () => client.get("/auth/me");