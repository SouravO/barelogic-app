import { useLayoutEffect, useRef } from 'react';

/**
 * Ref that always holds the latest `value`, for reading inside long-lived
 * callbacks (camera/detector handlers) without re-creating them.
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
