import { useState, useEffect } from "react";
import { ApiResponse } from "./backend";

interface UseApiOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { autoFetch = true, refreshInterval } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.error) {
        setError(response.error);
        setData(null);
      } else {
        setData(response.data || null);
        setError(null);
      }
    } catch (err) {
      setError("Unexpected error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Utility hook for multiple API calls
export function useMultipleApi<T extends Record<string, any>>(
  apiCalls: { [K in keyof T]: () => Promise<ApiResponse<T[K]>> },
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isAnyLoading, setIsAnyLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setIsAnyLoading(true);
    const newData: Partial<T> = {};
    const newErrors: Partial<Record<keyof T, string>> = {};

    const promises = Object.entries(apiCalls).map(async ([key, apiCall]) => {
      try {
        const response = await (apiCall as () => Promise<ApiResponse<any>>)();
        if (response.error) {
          newErrors[key as keyof T] = response.error;
        } else {
          newData[key as keyof T] = response.data;
        }
      } catch (err) {
        newErrors[key as keyof T] = "Unexpected error occurred";
      }
    });

    await Promise.all(promises);

    setData(newData);
    setErrors(newErrors);
    setLoading(false);
    setIsAnyLoading(false);
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchAll();
    }
  }, [options.autoFetch]);

  useEffect(() => {
    if (options.refreshInterval && options.refreshInterval > 0) {
      const interval = setInterval(fetchAll, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [options.refreshInterval]);

  return {
    data,
    loading,
    errors,
    isAnyLoading,
    refetch: fetchAll,
  };
}
