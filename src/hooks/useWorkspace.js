import { useState, useEffect, useCallback } from "react";
import { workspaceApi } from "../api";

export function useWorkspace() {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchWorkspace = useCallback(async () => {
    setLoading(true);
    try {
      const res = await workspaceApi.getWorkspace();
      setWorkspace(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWorkspace(); }, [fetchWorkspace]);

  return { workspace, loading, error, refetch: fetchWorkspace };
}