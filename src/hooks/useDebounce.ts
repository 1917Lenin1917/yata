import { useEffect, useState } from "react";

export const useDebounce = <T>(initialValue: T, timeout: number) => {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => setState(initialValue), timeout);

    return () => clearTimeout(timeoutId);
  }, [initialValue, timeout]);

  return state;
};
