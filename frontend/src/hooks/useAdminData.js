import { useCallback, useEffect, useState } from "react";

const useAdminData = (fetcher, deps = [], { initialData = null } = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { data: data ?? initialData, loading, error, reload: load };
};

export default useAdminData;
