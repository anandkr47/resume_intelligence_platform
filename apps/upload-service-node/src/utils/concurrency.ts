/**
 * In-process concurrency limiter for upload handlers.
 * When UPLOAD_MAX_CONCURRENT is set, limits how many uploads run at once per replica
 * so the server can handle many connections without OOM; scale via replicas for more capacity.
 */

export function createConcurrencyLimiter(maxConcurrent: number): {
  acquire: () => Promise<void>;
  release: () => void;
} {
  if (maxConcurrent <= 0) {
    return {
      acquire: async () => {},
      release: () => {},
    };
  }

  let inFlight = 0;
  const waitQueue: Array<() => void> = [];

  return {
    acquire(): Promise<void> {
      if (inFlight < maxConcurrent) {
        inFlight++;
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        waitQueue.push(() => {
          inFlight++;
          resolve();
        });
      });
    },
    release(): void {
      inFlight--;
      if (waitQueue.length > 0 && inFlight < maxConcurrent) {
        const next = waitQueue.shift();
        if (next) next();
      }
    },
  };
}
