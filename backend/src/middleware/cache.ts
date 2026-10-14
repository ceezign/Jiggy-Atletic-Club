import { Request, Response, NextFunction } from "express";

// Tiny in-memory cache for public, read-only GET endpoints.
// Cuts repeat database round-trips (the main cause of slow page loads when the
// database is far from the server). Cleared automatically on any admin change.
const store = new Map<string, { expires: number; body: unknown }>();

export function cacheFor(seconds: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();
    const key = req.originalUrl;
    const hit = store.get(key);
    if (hit && hit.expires > Date.now()) {
      res.setHeader("X-Cache", "HIT");
      return res.json(hit.body);
    }
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      if (res.statusCode === 200) store.set(key, { expires: Date.now() + seconds * 1000, body });
      return originalJson(body);
    };
    next();
  };
}

export function clearCache() {
  store.clear();
}
