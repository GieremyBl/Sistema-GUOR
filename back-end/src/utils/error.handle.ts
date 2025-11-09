import { Response } from "express";

export const handleHttp = (res: Response, error: string, errorRaw?: any) => {
    console.error(errorRaw);
    res.status(500).send({ error });
};

export class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'CustomError';
    }
}

export const handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }

    console.error('Unexpected Error: ', error);
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
};