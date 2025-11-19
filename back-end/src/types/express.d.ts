import { AuthUser } from './auth.types';

declare global {
    var JWT_SECRET_KEY: string;
    namespace Express {
        interface Request {
            user?: AuthUser | undefined;
        }
    }
}