export const isOwner = (user) => user?.role === "Owner";
export const isAdmin = (user) => user?.role === "Admin" || user?.role === "Owner";
export const isMember = (user) => user?.role === "Member";