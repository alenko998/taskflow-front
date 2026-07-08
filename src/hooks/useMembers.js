import { useState, useEffect, useCallback } from "react";
import { workspaceApi } from "../api";

export function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await workspaceApi.getMembers();
      setMembers(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers };
}