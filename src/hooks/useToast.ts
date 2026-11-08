/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';

export function useToast(defaultDurationMs: number = 3500) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string, durationMs?: number) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, durationMs || defaultDurationMs);
  }, [defaultDurationMs]);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return { toastMessage, showToast, clearToast };
}
