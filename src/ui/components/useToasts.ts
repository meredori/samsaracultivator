import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Icon, Tone } from "./types";

export interface ToastData {
  id: number;
  message: ReactNode;
  icon?: Icon;
  tone?: Tone;
}

/** Holds a list of toasts that dismiss themselves after `duration` ms. */
export function useToasts(duration = 4000) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    (toast: Omit<ToastData, "id">) => {
      const id = nextId.current++;
      setToasts((list) => [...list, { ...toast, id }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
      return id;
    },
    [dismiss, duration],
  );

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach(clearTimeout);
  }, []);

  return { toasts, push, dismiss };
}
