import { RequestHandler } from 'express';

export const asyncHandler: (fn: RequestHandler) => RequestHandler = (fn) => (req, res, next) => {
   return Promise.resolve(fn(req, res, next)).catch(next);
};
