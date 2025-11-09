import { Request, Response } from 'express';
import { AuthenticatedRequestHandler } from './handler.types';

export interface BaseController<T = any> {
  getAll: (req: Request, res: Response) => Promise<void | Response>;
  getById: (req: Request, res: Response) => Promise<void | Response>;
  create: AuthenticatedRequestHandler;
  update: AuthenticatedRequestHandler;
  delete: AuthenticatedRequestHandler;
}