import { Request, Response, NextFunction, RequestHandler as ExpressRequestHandler } from 'express';
import { AuthUser } from './auth.types';

export type RequestWithUser<P = any, ResBody = any, ReqBody = any> = Request<P, ResBody, ReqBody> & { 
  user: AuthUser;
};

export type AuthenticatedRequestHandler<P = any, ResBody = any, ReqBody = any> = 
  ExpressRequestHandler<P, ResBody, ReqBody> & {
    (req: RequestWithUser<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction): Promise<void | Response> | void | Response;
  };